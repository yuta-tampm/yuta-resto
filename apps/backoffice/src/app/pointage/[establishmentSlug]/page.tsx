import { PointageEmployee } from './_components/pointage-employee';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Only neutral presentation is rendered here. Employee authority and data
// must never be fetched or serialized by this server entry.
function PointagePage() {
  return <PointageEmployee />;
}

export { PointagePage as default };
