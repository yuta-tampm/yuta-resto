import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/aujourdhui',
}));

vi.mock('../src/app/(authenticated)/actions', () => ({
  logoutAction: vi.fn(),
}));

vi.mock('../src/components/backoffice/tenant-switcher', () => ({
  TenantSwitcher: () => <div>Établissement actif</div>,
}));

vi.mock('../src/components/backoffice/logout-submit-button', () => ({
  LogoutSubmitButton: () => <button type="submit">Se déconnecter</button>,
}));

import { BackofficeFrame } from '../src/components/backoffice/backoffice-frame';

describe('BackofficeFrame Product Release footer', () => {
  it('renders the Core release in the existing authenticated shell footer', () => {
    const markup = renderToStaticMarkup(
      <BackofficeFrame
        currentUser={{ name: 'Test User', email: 'test@example.test' }}
        tenantSwitcher={{ tenants: [], currentMembershipId: 'membership-1' }}
        canManageUsers={false}
        canReadPersonnel={false}
        canManageBookingSettings={false}
        bookingEnabled={false}
        reputationEnabled={false}
      >
        <p>Page content</p>
      </BackofficeFrame>,
    );

    const footer = markup.match(/<footer\b[^>]*>(.*?)<\/footer>/s)?.[1];
    expect(footer).toBeDefined();
    expect(footer).toContain('Espace restaurateur YUTA Alpha · v0.1.0-alpha.1');
    expect(footer).toContain('© 2025 YuTa Solutions. Tous droits reserves.');
    expect(markup).not.toContain('YUTA v1.0.0');
    expect(markup).toContain('Page content');
    expect(markup).toContain('Établissement actif');
  });
});
