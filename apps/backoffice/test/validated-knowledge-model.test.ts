import { describe, expect, it } from 'vitest';
import {
  acceptValidatedKnowledgeStatement,
  draftFromValidatedItem,
  hasNonWhitespace,
  isValidatedKnowledgeDraftDirty,
  markValidatedKnowledgeForRemoval,
  newValidatedKnowledgeDraft,
  undoValidatedKnowledgeRemoval,
} from '../src/app/(authenticated)/etablissement/informations-generales/validated-knowledge-model';

describe('Validated Knowledge model', () => {
  it.each(['', '   ', '\n\t '])('rejects whitespace-only %j', (value) => {
    expect(hasNonWhitespace(value)).toBe(false);
  });

  it.each(['abc', ' abc ', '  a  '])('accepts and preserves %j', (value) => {
    expect(hasNonWhitespace(value)).toBe(true);
    expect(value).toBe(value);
  });

  it('keeps browser draft identity separate from canonical identity', () => {
    const draft = newValidatedKnowledgeDraft('draft:local');
    expect(draft).toMatchObject({
      key: 'draft:local',
      id: null,
      statement: '',
    });
  });

  it('tracks edit and removal independently', () => {
    const draft = draftFromValidatedItem({
      id: 'item-id',
      statement: 'Initial',
    });
    expect(isValidatedKnowledgeDraftDirty(draft)).toBe(false);
    const pending = markValidatedKnowledgeForRemoval(draft);
    expect(isValidatedKnowledgeDraftDirty(pending)).toBe(true);
    expect(undoValidatedKnowledgeRemoval(pending)).toEqual(draft);
  });

  it('accepts a canonical response without remount', () => {
    const draft = {
      ...newValidatedKnowledgeDraft('draft:local'),
      statement: ' abc ',
    };
    expect(
      acceptValidatedKnowledgeStatement(draft, {
        id: 'server-id',
        statement: ' abc ',
      }),
    ).toEqual({
      key: 'server-id',
      id: 'server-id',
      acceptedStatement: ' abc ',
      statement: ' abc ',
      pendingRemoval: false,
    });
  });
});
