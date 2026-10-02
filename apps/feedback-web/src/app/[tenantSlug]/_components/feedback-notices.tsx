import { Alert, AlertDescription } from '@yuta/ui';
import { LockKeyhole } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4 text-left">
      <LockKeyhole
        className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
        aria-hidden="true"
      />
      <div>
        <p className="font-semibold text-brand-700">Avis 100% privé</p>
        <p className="mt-1 text-xs leading-5 text-secondary">
          Vos réponses sont confidentielles et ne seront pas publiées.
        </p>
      </div>
    </div>
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <Alert className="mt-6" tone="danger">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
