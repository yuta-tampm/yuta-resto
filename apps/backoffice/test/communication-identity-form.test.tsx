import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Values = {
  toneAndCommunicationStyle: string | null;
  customerAddressing: string | null;
  languageElementsAndThingsToAvoid: string | null;
};

const mocks = vi.hoisted(() => ({
  actionState: {
    status: 'idle' as 'idle' | 'success' | 'error',
    message: null as string | null,
    savedCommunicationIdentity: null as Values | null,
  },
  draftOverride: null as Values | null,
  pending: false,
  saveCommunicationIdentityAction: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/actions',
  () => ({
    saveCommunicationIdentityAction: mocks.saveCommunicationIdentityAction,
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
    useState: (initial: unknown) => [mocks.draftOverride ?? initial, vi.fn()],
  };
});

import {
  CommunicationIdentityForm,
  CommunicationIdentitySubmitButton,
} from '../src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form';

const values: Values = {
  toneAndCommunicationStyle: 'Chaleureux',
  customerAddressing: 'Avec naturel',
  languageElementsAndThingsToAvoid: 'Des mots simples',
};

describe('CommunicationIdentityForm', () => {
  beforeEach(() => {
    mocks.actionState = {
      status: 'idle',
      message: null,
      savedCommunicationIdentity: null,
    };
    mocks.draftOverride = null;
    mocks.pending = false;
    mocks.saveCommunicationIdentityAction.mockReset();
  });

  it('renders one explicit whole-slice save and does not autosave on render', () => {
    const markup = renderToStaticMarkup(
      <CommunicationIdentityForm communicationIdentity={values} canManage />,
    );

    expect(markup.match(/<form/g)).toHaveLength(1);
    expect(markup.match(/type="submit"/g)).toHaveLength(1);
    expect(markup).toContain('Enregistrer identité de communication');
    expect(markup).toContain('name="toneAndCommunicationStyle"');
    expect(markup).toContain('name="customerAddressing"');
    expect(markup).toContain('name="languageElementsAndThingsToAvoid"');
    expect(markup).toContain('disabled=""');
    expect(mocks.saveCommunicationIdentityAction).not.toHaveBeenCalled();
  });

  it('renders canManage false with disabled values and no save control', () => {
    const markup = renderToStaticMarkup(
      <CommunicationIdentityForm
        communicationIdentity={values}
        canManage={false}
      />,
    );

    expect(markup).toContain('Identité de communication');
    expect(markup.match(/disabled=""/g)).toHaveLength(3);
    expect(markup).not.toContain('type="submit"');
    expect(mocks.saveCommunicationIdentityAction).not.toHaveBeenCalled();
  });

  it('keeps a canonical-equivalent successful save pristine without remount', () => {
    mocks.draftOverride = {
      toneAndCommunicationStyle: '',
      customerAddressing: '',
      languageElementsAndThingsToAvoid: '',
    };
    mocks.actionState = {
      status: 'success',
      message: 'Identité de communication enregistrée.',
      savedCommunicationIdentity: {
        toneAndCommunicationStyle: null,
        customerAddressing: null,
        languageElementsAndThingsToAvoid: null,
      },
    };

    const markup = renderToStaticMarkup(
      <CommunicationIdentityForm
        communicationIdentity={{
          toneAndCommunicationStyle: null,
          customerAddressing: null,
          languageElementsAndThingsToAvoid: null,
        }}
        canManage
      />,
    );

    expect(markup).toContain('role="status"');
    expect(markup).toMatch(/<button[^>]*disabled=""/);
  });

  it('keeps clearing a non-empty baseline dirty and enables the same submit', () => {
    mocks.draftOverride = {
      toneAndCommunicationStyle: '',
      customerAddressing: null,
      languageElementsAndThingsToAvoid: null,
    };

    const markup = renderToStaticMarkup(
      <CommunicationIdentityForm
        communicationIdentity={{
          toneAndCommunicationStyle: 'abc',
          customerAddressing: null,
          languageElementsAndThingsToAvoid: null,
        }}
        canManage
      />,
    );

    expect(markup).toMatch(/<button[^>]*type="submit"/);
    expect(markup).not.toMatch(/<button[^>]*disabled=""/);
  });

  it('shows pending state on the same submit control', () => {
    mocks.pending = true;
    const markup = renderToStaticMarkup(
      <CommunicationIdentitySubmitButton disabled={false} />,
    );

    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('Enregistrement…');
    expect(markup).not.toContain('Enregistrer identité de communication');
  });

  it('retains the failed draft and renders a recoverable alert', () => {
    mocks.draftOverride = {
      toneAndCommunicationStyle: 'Brouillon conservé',
      customerAddressing: '',
      languageElementsAndThingsToAvoid: '',
    };
    mocks.actionState = {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
      savedCommunicationIdentity: values,
    };

    const markup = renderToStaticMarkup(
      <CommunicationIdentityForm communicationIdentity={values} canManage />,
    );

    expect(markup).toContain('Une erreur est survenue. Réessayez.');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('Brouillon conservé');
    expect(markup).not.toMatch(/<button[^>]*disabled=""/);
  });
});
