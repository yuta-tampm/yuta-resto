import { performance } from 'node:perf_hooks';
import { config } from 'dotenv';
import { and, eq } from 'drizzle-orm';
import type { CreatePublicReservationInput } from '@yuta/contracts/reservations';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import {
  BookingRepositoryError,
  createPublicReservation,
  getPublicAvailability,
  type PublicBookingConfiguration,
} from '../src/booking-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  bookingAuditEvents,
  bookingNotificationDeliveries,
  bookingServicePeriods,
  establishments,
  organizations,
  reservations,
  reservationStatusHistory,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const reliabilityEnvironmentSchema = z.object({
  BOOKING_RELIABILITY_AVAILABILITY_READS: z.coerce
    .number()
    .int()
    .min(1)
    .max(500)
    .default(100),
  BOOKING_RELIABILITY_CREATION_BURST: z.coerce
    .number()
    .int()
    .min(2)
    .max(100)
    .default(30),
});

const reliabilityTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_BOOKING_RELIABILITY_TESTS === 'true'
    ? describe
    : describe.skip;

function percentile(values: number[], ratio: number) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.max(0, Math.ceil(sorted.length * ratio) - 1)] ?? 0;
}

reliabilityTest.sequential('booking reliability baseline', () => {
  const reliabilityEnvironment = reliabilityEnvironmentSchema.parse(
    process.env,
  );
  const availabilityReadCount =
    reliabilityEnvironment.BOOKING_RELIABILITY_AVAILABILITY_READS;
  const creationBurst =
    reliabilityEnvironment.BOOKING_RELIABILITY_CREATION_BURST;
  const acceptedReservationCount = Math.ceil(creationBurst / 2);
  const slotCapacity = acceptedReservationCount * 2;

  let db: CloudDatabaseClient;
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const servicePeriodId = uuidv7();
  const bookingDate = '2030-01-07';
  const bookingTime = '12:00';
  const now = new Date('2029-01-01T10:00:00.000Z');

  const bookingConfig: PublicBookingConfiguration = {
    organizationId,
    establishmentId,
    establishmentName: 'Booking reliability establishment',
    slug: `booking-reliability-${establishmentId}`,
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    enabled: true,
    confirmationMode: 'AUTOMATIC',
    minimumPartySize: 1,
    maximumPartySize: 12,
    slotIntervalMinutes: 30,
    averageDurationMinutes: 90,
    minimumNoticeMinutes: 0,
    bookingWindowDays: 3650,
    cancellationDeadlineMinutes: 0,
    publicPhone: null,
    publicEmail: null,
    address: null,
    welcomeMessage: null,
    bookingPolicy: null,
    logoUrl: null,
    coverImageUrl: null,
  };

  const bookingInput = (guestNumber: number): CreatePublicReservationInput => ({
    date: bookingDate,
    time: bookingTime,
    partySize: 2,
    guest: {
      firstName: `Guest ${guestNumber}`,
      lastName: 'Reliability',
      email: `booking-reliability-${guestNumber}-${establishmentId}@example.test`,
      phone: `+336${String(guestNumber).padStart(8, '0')}`,
    },
    source: 'DIRECT',
    marketingConsent: false,
    policyAccepted: true,
    idempotencyKey: `booking-reliability-${guestNumber}-${uuidv7()}`,
  });

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    await db.insert(organizations).values({
      id: organizationId,
      name: 'Booking reliability organization',
      slug: `booking-reliability-${organizationId}`,
    });
    await db.insert(establishments).values({
      id: establishmentId,
      organizationId,
      name: bookingConfig.establishmentName,
      slug: bookingConfig.slug,
    });
    await db.insert(bookingServicePeriods).values({
      id: servicePeriodId,
      organizationId,
      establishmentId,
      dayOfWeek: 1,
      name: 'Monday lunch',
      startTime: bookingTime,
      endTime: '12:30',
      capacity: slotCapacity,
    });
  });

  afterAll(async () => {
    if (!db) return;

    for (const table of [
      bookingNotificationDeliveries,
      bookingAuditEvents,
      reservationStatusHistory,
    ]) {
      await db.delete(table).where(eq(table.organizationId, organizationId));
    }
    await db
      .delete(reservations)
      .where(eq(reservations.organizationId, organizationId));
    await db
      .delete(bookingServicePeriods)
      .where(eq(bookingServicePeriods.organizationId, organizationId));
    await db
      .delete(establishments)
      .where(eq(establishments.id, establishmentId));
    await db.delete(organizations).where(eq(organizations.id, organizationId));
    await db.$client.end({ timeout: 5 });
  });

  it('keeps repeated concurrent availability reads consistent', async () => {
    const durations: number[] = [];
    const results = await Promise.all(
      Array.from({ length: availabilityReadCount }, async () => {
        const startedAt = performance.now();
        const slots = await getPublicAvailability(db, bookingConfig, {
          date: bookingDate,
          partySize: 2,
          now,
        });
        durations.push(performance.now() - startedAt);
        return slots;
      }),
    );

    expect(results).toHaveLength(availabilityReadCount);
    for (const slots of results) {
      expect(slots).toEqual(results[0]);
      expect(slots).toEqual([
        expect.objectContaining({
          time: bookingTime,
          available: true,
          remainingCapacity: slotCapacity,
        }),
      ]);
    }

    const p95Ms = Math.round(percentile(durations, 0.95));
    expect(p95Ms).toBeLessThanOrEqual(500);

    console.info(
      JSON.stringify({
        scenario: 'booking-availability-repeated-reads',
        requests: availabilityReadCount,
        p50Ms: Math.round(percentile(durations, 0.5)),
        p95Ms,
        maxMs: Math.round(Math.max(...durations)),
      }),
    );
  });

  it('preserves capacity and outbox accounting during a creation burst', async () => {
    const durations: number[] = [];
    const outcomes = await Promise.allSettled(
      Array.from({ length: creationBurst }, async (_, index) => {
        const startedAt = performance.now();
        try {
          return await createPublicReservation(
            db,
            bookingConfig,
            bookingInput(index + 1),
            now,
          );
        } finally {
          durations.push(performance.now() - startedAt);
        }
      }),
    );
    const fulfilled = outcomes.filter(
      (outcome) => outcome.status === 'fulfilled',
    );
    const rejected = outcomes.filter(
      (outcome) => outcome.status === 'rejected',
    );

    expect(fulfilled).toHaveLength(acceptedReservationCount);
    expect(rejected).toHaveLength(creationBurst - acceptedReservationCount);
    for (const outcome of rejected) {
      expect(outcome.reason).toBeInstanceOf(BookingRepositoryError);
      expect(outcome.reason).toMatchObject({ code: 'SLOT_UNAVAILABLE' });
    }

    const p95Ms = Math.round(percentile(durations, 0.95));
    expect(p95Ms).toBeLessThanOrEqual(1_000);

    const persistedReservations = await db
      .select({
        id: reservations.id,
        partySize: reservations.partySize,
        status: reservations.status,
      })
      .from(reservations)
      .where(
        and(
          eq(reservations.organizationId, organizationId),
          eq(reservations.establishmentId, establishmentId),
          eq(reservations.localDate, bookingDate),
        ),
      );
    expect(persistedReservations).toHaveLength(acceptedReservationCount);
    expect(
      persistedReservations.reduce(
        (total, reservation) => total + reservation.partySize,
        0,
      ),
    ).toBe(slotCapacity);
    expect(
      persistedReservations.every(
        (reservation) => reservation.status === 'CONFIRMED',
      ),
    ).toBe(true);

    const outboxRows = await db
      .select({
        reservationId: bookingNotificationDeliveries.reservationId,
        eventType: bookingNotificationDeliveries.eventType,
        status: bookingNotificationDeliveries.status,
        attemptCount: bookingNotificationDeliveries.attemptCount,
      })
      .from(bookingNotificationDeliveries)
      .where(
        and(
          eq(bookingNotificationDeliveries.organizationId, organizationId),
          eq(bookingNotificationDeliveries.establishmentId, establishmentId),
        ),
      );
    expect(outboxRows).toHaveLength(acceptedReservationCount);
    expect(new Set(outboxRows.map((row) => row.reservationId)).size).toBe(
      acceptedReservationCount,
    );
    expect(
      outboxRows.every(
        (row) =>
          row.eventType === 'RESERVATION_CREATED' &&
          row.status === 'PENDING' &&
          row.attemptCount === 0,
      ),
    ).toBe(true);

    const finalSlots = await getPublicAvailability(db, bookingConfig, {
      date: bookingDate,
      partySize: 2,
      now,
    });
    expect(finalSlots).toEqual([
      expect.objectContaining({
        time: bookingTime,
        available: false,
        remainingCapacity: 0,
      }),
    ]);

    console.info(
      JSON.stringify({
        scenario: 'booking-creation-contention',
        requests: creationBurst,
        accepted: fulfilled.length,
        rejected: rejected.length,
        unexpectedErrors: 0,
        pendingOutbox: outboxRows.length,
        p50Ms: Math.round(percentile(durations, 0.5)),
        p95Ms,
        maxMs: Math.round(Math.max(...durations)),
      }),
    );
  }, 30_000);
});
