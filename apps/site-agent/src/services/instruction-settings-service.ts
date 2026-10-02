import {
  localInstructionSettingsSchema,
  type LocalInstructionSettings,
  type UpdateLocalInstructionSettingsInput,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import {
  menuCategories,
  menuItems,
  posInstructionSettings,
} from '@yuta/db-pos/schema';
import { eq } from 'drizzle-orm';
import { HttpError } from '../http';

const settingsId = 'default';

export function createInstructionSettingsService(db: PosDatabaseExecutor) {
  async function updateInstructionSettings(
    input: UpdateLocalInstructionSettingsInput,
  ) {
    assertUniqueCodes(input.quickInstructionOptions, 'quick instruction');
    assertUniqueCodes(input.allergenOptions, 'allergen');
    const quickCodes = new Set(
      input.quickInstructionOptions.map(({ code }) => code),
    );
    for (const option of input.quickInstructionOptions) {
      if (option.conflictsWith.some((code) => !quickCodes.has(code))) {
        throw new HttpError(
          422,
          'UNKNOWN_INSTRUCTION_CONFLICT',
          `Instruction ${option.code} references an unknown conflict.`,
        );
      }
    }

    const [categories, items] = await Promise.all([
      db.select().from(menuCategories),
      db.select().from(menuItems),
    ]);
    const assignedCodes = new Set([
      ...categories.flatMap((category) => [
        ...category.defaultInstructionCodes,
        ...category.additionalInstructionCodes,
      ]),
      ...items.flatMap((item) => [
        ...(item.defaultInstructionCodes ?? []),
        ...(item.additionalInstructionCodes ?? []),
      ]),
    ]);
    if ([...assignedCodes].some((code) => !quickCodes.has(code))) {
      throw new HttpError(
        409,
        'INSTRUCTION_OPTION_IN_USE',
        'Remove the instruction from categories and items before deleting it.',
      );
    }

    const [updated] = await db
      .insert(posInstructionSettings)
      .values({ id: settingsId, ...input })
      .onConflictDoUpdate({
        target: posInstructionSettings.id,
        set: input,
      })
      .returning();
    return localInstructionSettingsSchema.parse(toInstructionSettings(updated));
  }

  return { updateInstructionSettings };
}

export async function ensureInstructionSettings(
  db: PosDatabaseExecutor,
): Promise<typeof posInstructionSettings.$inferSelect> {
  await db
    .insert(posInstructionSettings)
    .values({ id: settingsId })
    .onConflictDoNothing();
  const settings = await db.query.posInstructionSettings.findFirst({
    where: eq(posInstructionSettings.id, settingsId),
  });
  if (!settings) throw new Error('POS instruction settings are unavailable.');
  return settings;
}

export function resolveInstructionConfig(
  settings: LocalInstructionSettings,
  category: {
    defaultInstructionCodes: string[];
    additionalInstructionCodes: string[];
  },
  item: {
    defaultInstructionCodes: string[] | null;
    additionalInstructionCodes: string[] | null;
  },
) {
  const byCode = new Map(
    settings.quickInstructionOptions.map((option) => [option.code, option]),
  );
  const defaultCodes =
    item.defaultInstructionCodes ?? category.defaultInstructionCodes;
  const additionalCodes =
    item.additionalInstructionCodes ?? category.additionalInstructionCodes;
  return {
    defaultOptions: defaultCodes.flatMap((code) => {
      const option = byCode.get(code);
      return option ? [option] : [];
    }),
    additionalOptions: additionalCodes.flatMap((code) => {
      const option = byCode.get(code);
      return option ? [option] : [];
    }),
  };
}

export function assertInstructionAssignments(
  settings: LocalInstructionSettings,
  input: {
    defaultInstructionCodes: string[] | null;
    additionalInstructionCodes: string[] | null;
  },
): void {
  if (
    (input.defaultInstructionCodes === null) !==
    (input.additionalInstructionCodes === null)
  ) {
    throw new HttpError(
      422,
      'INSTRUCTION_INHERITANCE_INVALID',
      'Both instruction lists must inherit from the category together.',
    );
  }
  const knownCodes = new Set(
    settings.quickInstructionOptions.map(({ code }) => code),
  );
  const selectedCodes = [
    ...(input.defaultInstructionCodes ?? []),
    ...(input.additionalInstructionCodes ?? []),
  ];
  if (new Set(selectedCodes).size !== selectedCodes.length) {
    throw new HttpError(
      422,
      'DUPLICATE_INSTRUCTION_ASSIGNMENT',
      'An instruction can appear only once in a configuration.',
    );
  }
  if (selectedCodes.some((code) => !knownCodes.has(code))) {
    throw new HttpError(
      422,
      'UNKNOWN_INSTRUCTION_ASSIGNMENT',
      'The configuration references an unknown quick instruction.',
    );
  }
}

function assertUniqueCodes(
  options: Array<{ code: string }>,
  label: string,
): void {
  const codes = options.map(({ code }) => code);
  if (new Set(codes).size !== codes.length) {
    throw new HttpError(
      422,
      'DUPLICATE_OPTION_CODE',
      `Each ${label} code must be unique.`,
    );
  }
}

function toInstructionSettings(
  settings: typeof posInstructionSettings.$inferSelect,
): LocalInstructionSettings {
  return {
    quickInstructionOptions: settings.quickInstructionOptions,
    allergenOptions: settings.allergenOptions,
  };
}
