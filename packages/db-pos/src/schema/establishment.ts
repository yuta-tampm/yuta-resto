import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const posEstablishmentProfiles = pgTable(
  'pos_establishment_profiles',
  {
    id: varchar('id', { length: 32 }).primaryKey(),
    displayName: varchar('display_name', { length: 80 }).notNull(),
    revision: integer('revision').default(1).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      'pos_establishment_profiles_singleton_check',
      sql`${table.id} = 'default'`,
    ),
    check(
      'pos_establishment_profiles_display_name_check',
      sql`char_length(${table.displayName}) between 1 and 80 and ${table.displayName} = btrim(${table.displayName}) and ${table.displayName} !~ '[[:cntrl:]]'`,
    ),
    check(
      'pos_establishment_profiles_revision_check',
      sql`${table.revision} >= 1`,
    ),
  ],
);

export type PosEstablishmentProfile =
  typeof posEstablishmentProfiles.$inferSelect;
