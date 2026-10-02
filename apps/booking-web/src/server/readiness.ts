import 'server-only';

export const BOOKING_READINESS_TIMEOUT_MS = 2_000;

export async function isDependencyReady(
  probe: () => Promise<unknown>,
  timeoutMs = BOOKING_READINESS_TIMEOUT_MS,
): Promise<boolean> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      probe(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error('Readiness probe timed out.')),
          timeoutMs,
        );
      }),
    ]);
    return true;
  } catch {
    return false;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
