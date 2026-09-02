import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  actionState: {
    status: 'idle' as 'idle' | 'success' | 'error',
    message: null as string | null,
  },
  pending: false,
  saveTeamCultureAction: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/actions',
  () => ({
    saveTeamCultureAction: mocks.saveTeamCultureAction,
  }),
);
vi.mock('react-dom', () => ({
  useFormStatus: () => ({ pending: mocks.pending }),
}));
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useActionState: () => [mocks.actionState, vi.fn()],
  };
});

import {
  TeamCultureForm,
  TeamCultureSubmitButton,
} from '../src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form';

const values = {
  valuesAndMindset: 'Bienveillance',
  workingTogether: 'Décisions partagées',
  transmissionAndIntegration: 'Accompagnement',
};

describe('TeamCultureForm', () => {
  beforeEach(() => {
    mocks.actionState = { status: 'idle', message: null };
    mocks.pending = false;
    mocks.saveTeamCultureAction.mockReset();
  });

  it('renders one explicit whole-slice save and does not autosave on render', () => {
    const markup = renderToStaticMarkup(
      <TeamCultureForm teamCulture={values} canManage />,
    );

    expect(markup.match(/<form/g)).toHaveLength(1);
    expect(markup.match(/type="submit"/g)).toHaveLength(1);
    expect(markup).toContain('Enregistrer équipe &amp; culture');
    expect(markup).toContain('name="valuesAndMindset"');
    expect(markup).toContain('name="workingTogether"');
    expect(markup).toContain('name="transmissionAndIntegration"');
    expect(markup).toContain('disabled=""');
    expect(mocks.saveTeamCultureAction).not.toHaveBeenCalled();
  });

  it('renders canManage false as presentation-only disabled values with no save control', () => {
    const markup = renderToStaticMarkup(
      <TeamCultureForm teamCulture={values} canManage={false} />,
    );

    expect(markup).toContain('Équipe &amp; culture');
    expect(markup.match(/disabled=""/g)).toHaveLength(3);
    expect(markup).not.toContain('type="submit"');
    expect(mocks.saveTeamCultureAction).not.toHaveBeenCalled();
  });

  it('keeps canonical all-empty state pristine without relying on a key change', () => {
    const markup = renderToStaticMarkup(
      <TeamCultureForm
        teamCulture={{
          valuesAndMindset: null,
          workingTogether: null,
          transmissionAndIntegration: null,
        }}
        canManage
      />,
    );

    expect(markup.match(/type="submit"/g)).toHaveLength(1);
    expect(markup).toContain('disabled=""');
    expect(mocks.saveTeamCultureAction).not.toHaveBeenCalled();
  });

  it('shows pending state on the same submit control', () => {
    mocks.pending = true;
    const markup = renderToStaticMarkup(
      <TeamCultureSubmitButton disabled={false} />,
    );

    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('Enregistrement…');
    expect(markup).not.toContain('Enregistrer équipe &amp; culture');
  });

  it('renders the successful explicit-save message', () => {
    mocks.actionState = {
      status: 'success',
      message: 'Équipe et culture enregistrées.',
    };

    const markup = renderToStaticMarkup(
      <TeamCultureForm teamCulture={values} canManage />,
    );

    expect(markup).toContain('Équipe et culture enregistrées.');
    expect(markup).toContain('role="status"');
  });

  it('renders a failed save as an alert for recoverable retry', () => {
    mocks.actionState = {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    };

    const markup = renderToStaticMarkup(
      <TeamCultureForm teamCulture={values} canManage />,
    );

    expect(markup).toContain('Une erreur est survenue. Réessayez.');
    expect(markup).toContain('role="alert"');
  });
});
