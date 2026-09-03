import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/actions',
  () => ({
    createValidatedKnowledgeAction: mocks.create,
    updateValidatedKnowledgeAction: mocks.update,
    removeValidatedKnowledgeAction: mocks.remove,
  }),
);
vi.mock('react-dom', () => ({ useFormStatus: () => ({ pending: false }) }));
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useActionState: () => [
      {
        status: 'idle',
        message: null,
        fieldError: null,
        item: null,
        removedItemId: null,
      },
      vi.fn(),
    ],
  };
});

import { ValidatedKnowledgeSection } from '../src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section';

describe('ValidatedKnowledgeSection', () => {
  beforeEach(() => {
    mocks.create.mockReset();
    mocks.update.mockReset();
    mocks.remove.mockReset();
  });

  it('renders the valid empty state and one explicit add control for MANAGE', () => {
    const markup = renderToStaticMarkup(
      <ValidatedKnowledgeSection items={[]} canManage />,
    );
    expect(markup).toContain('Connaissances validées');
    expect(markup).toContain('Aucune connaissance validée');
    expect(markup.match(/Ajouter une connaissance/g)).toHaveLength(1);
    expect(markup).not.toContain('<form');
  });

  it('renders current items without mutation controls when canManage is false', () => {
    const markup = renderToStaticMarkup(
      <ValidatedKnowledgeSection
        items={[
          { id: '018f0000-0000-7000-8000-000000000001', statement: 'Une' },
          { id: '018f0000-0000-7000-8000-000000000002', statement: 'Deux' },
        ]}
        canManage={false}
      />,
    );
    expect(markup).toContain('Une');
    expect(markup).toContain('Deux');
    expect(markup).not.toContain('<form');
    expect(markup).not.toContain('Ajouter une connaissance');
    expect(markup).not.toContain('Retirer');
    expect(markup).not.toContain('Enregistrer');
  });

  it('renders independent item-scoped edit and remove controls without autosave', () => {
    const markup = renderToStaticMarkup(
      <ValidatedKnowledgeSection
        items={[
          {
            id: '018f0000-0000-7000-8000-000000000001',
            statement: '  Connaissance exacte  ',
          },
        ]}
        canManage
      />,
    );
    expect(markup.match(/<form/g)).toHaveLength(1);
    expect(markup).toContain('name="id"');
    expect(markup).toContain('name="statement"');
    expect(markup).toContain('  Connaissance exacte  ');
    expect(markup).toContain('Retirer');
    expect(markup).toContain('Enregistrer');
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
  });
});
