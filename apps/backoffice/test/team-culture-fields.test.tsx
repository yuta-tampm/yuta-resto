import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { TeamCultureFields } from '../src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-fields';

const draft = {
  valuesAndMindset: 'Bienveillance',
  workingTogether: 'Décisions partagées',
  transmissionAndIntegration: 'Accompagnement',
};

function render(canManage: boolean) {
  return renderToStaticMarkup(
    <TeamCultureFields
      draft={draft}
      canManage={canManage}
      onValuesAndMindsetChange={vi.fn()}
      onWorkingTogetherChange={vi.fn()}
      onTransmissionAndIntegrationChange={vi.fn()}
    />,
  );
}

describe('TeamCultureFields', () => {
  it('renders exactly the three approved optional labelled values', () => {
    const markup = render(true);

    expect(markup.match(/<textarea/g)).toHaveLength(3);
    expect(markup).toContain('Valeurs &amp; état d’esprit');
    expect(markup).toContain('Façon de travailler ensemble');
    expect(markup).toContain('Transmission &amp; intégration');
    expect(markup).toContain('name="valuesAndMindset"');
    expect(markup).toContain('name="workingTogether"');
    expect(markup).toContain('name="transmissionAndIntegration"');
    expect(markup.match(/Optionnel/g)).toHaveLength(3);
  });

  it('associates labels and disables all values in presentation-only read mode', () => {
    const markup = render(false);

    expect(markup).toContain('for="valuesAndMindset"');
    expect(markup).toContain('for="workingTogether"');
    expect(markup).toContain('for="transmissionAndIntegration"');
    expect(markup.match(/disabled=""/g)).toHaveLength(3);
  });
});
