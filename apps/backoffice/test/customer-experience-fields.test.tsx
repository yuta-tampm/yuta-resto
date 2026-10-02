import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CustomerExperienceFields } from '../src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-fields';

function renderFields(
  desiredExperience: string | null,
  welcomeAndService: string | null,
  customerAttention: string | null,
  canManage = true,
): string {
  return renderToStaticMarkup(
    <CustomerExperienceFields
      draft={{ desiredExperience, welcomeAndService, customerAttention }}
      canManage={canManage}
      onDesiredExperienceChange={vi.fn()}
      onWelcomeAndServiceChange={vi.fn()}
      onCustomerAttentionChange={vi.fn()}
    />,
  );
}

describe('CustomerExperienceFields', () => {
  it.each([
    [null, null, null],
    ['Expérience seulement', null, null],
    [null, 'Accueil seulement', null],
    [null, null, 'Attention seulement'],
  ] as const)(
    'renders the valid empty and single-value states',
    (desiredExperience, welcomeAndService, customerAttention) => {
      const markup = renderFields(
        desiredExperience,
        welcomeAndService,
        customerAttention,
      );
      expect(markup).toContain('name="desiredExperience"');
      expect(markup).toContain('name="welcomeAndService"');
      expect(markup).toContain('name="customerAttention"');
      if (desiredExperience) expect(markup).toContain(desiredExperience);
      if (welcomeAndService) expect(markup).toContain(welcomeAndService);
      if (customerAttention) expect(markup).toContain(customerAttention);
    },
  );

  it('makes all three fields read-only without MANAGE', () => {
    expect(
      renderFields('Expérience', 'Accueil', 'Attention', false).match(
        /disabled=""/g,
      ),
    ).toHaveLength(3);
  });
});
