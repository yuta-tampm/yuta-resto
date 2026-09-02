import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CommunicationIdentityFields } from '../src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-fields';

const draft = {
  toneAndCommunicationStyle: 'Chaleureux',
  customerAddressing: 'Avec naturel',
  languageElementsAndThingsToAvoid: 'Des mots simples',
};

function render(canManage: boolean) {
  return renderToStaticMarkup(
    <CommunicationIdentityFields
      draft={draft}
      canManage={canManage}
      onToneAndCommunicationStyleChange={vi.fn()}
      onCustomerAddressingChange={vi.fn()}
      onLanguageElementsAndThingsToAvoidChange={vi.fn()}
    />,
  );
}

describe('CommunicationIdentityFields', () => {
  it('renders exactly the three approved optional labelled values', () => {
    const markup = render(true);

    expect(markup.match(/<textarea/g)).toHaveLength(3);
    expect(markup).toContain('Ton &amp; style de communication');
    expect(markup).toContain('Façon de s’adresser aux clients');
    expect(markup).toContain('Éléments de langage &amp; choses à éviter');
    expect(markup).toContain('name="toneAndCommunicationStyle"');
    expect(markup).toContain('name="customerAddressing"');
    expect(markup).toContain('name="languageElementsAndThingsToAvoid"');
    expect(markup.match(/Optionnel/g)).toHaveLength(3);
  });

  it('associates labels and disables all values in presentation-only read mode', () => {
    const markup = render(false);

    expect(markup).toContain('for="toneAndCommunicationStyle"');
    expect(markup).toContain('for="customerAddressing"');
    expect(markup).toContain('for="languageElementsAndThingsToAvoid"');
    expect(markup.match(/disabled=""/g)).toHaveLength(3);
  });
});
