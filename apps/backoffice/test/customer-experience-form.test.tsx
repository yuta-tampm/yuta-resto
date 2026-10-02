import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  saveCustomerExperienceAction: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/actions',
  () => ({
    saveCustomerExperienceAction: mocks.saveCustomerExperienceAction,
  }),
);

import { CustomerExperienceForm } from '../src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form';

const values = {
  desiredExperience: 'Expérience souhaitée',
  welcomeAndService: 'Accueil et service',
  customerAttention: 'Attention particulière',
};

describe('CustomerExperienceForm', () => {
  it('renders one explicit whole-slice save and does not autosave on render', () => {
    const markup = renderToStaticMarkup(
      <CustomerExperienceForm customerExperience={values} canManage />,
    );

    expect(markup.match(/<form/g)).toHaveLength(1);
    expect(markup.match(/type="submit"/g)).toHaveLength(1);
    expect(markup).toContain('Enregistrer l’expérience client');
    expect(markup).toContain('name="desiredExperience"');
    expect(markup).toContain('name="welcomeAndService"');
    expect(markup).toContain('name="customerAttention"');
    expect(markup).toContain('disabled=""');
    expect(mocks.saveCustomerExperienceAction).not.toHaveBeenCalled();
  });

  it('renders READ-only values without a save control', () => {
    const markup = renderToStaticMarkup(
      <CustomerExperienceForm customerExperience={values} canManage={false} />,
    );

    expect(markup).toContain('Expérience client');
    expect(markup.match(/disabled=""/g)).toHaveLength(3);
    expect(markup).not.toContain('type="submit"');
    expect(mocks.saveCustomerExperienceAction).not.toHaveBeenCalled();
  });
});
