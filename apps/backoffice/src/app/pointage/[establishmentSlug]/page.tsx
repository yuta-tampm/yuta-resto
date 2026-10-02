import { PointageEmployee } from './_components/pointage-employee';
import { requireBackofficeCapabilityAvailable } from '@/server/backoffice-exposure';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Only neutral presentation is rendered here. Employee authority and data
// must never be fetched or serialized by this server entry.
function PointagePage() {
  requireBackofficeCapabilityAvailable('pointage');
  return <PointageEmployee />;
}

export { PointagePage as default };
