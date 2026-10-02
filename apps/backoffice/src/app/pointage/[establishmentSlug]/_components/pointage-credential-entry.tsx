'use client';

import { Button, Card, FormField, Input } from '@yuta/ui';

// Controlled U5 input: the route owner clears the PIN on every identify settle.
export function PointageCredentialEntry({
  pin,
  pending,
  ended,
  onPinChange,
  onIdentify,
}: {
  pin: string;
  pending: boolean;
  ended: boolean;
  onPinChange: (pin: string) => void;
  onIdentify: () => Promise<void>;
}) {
  return (
    <Card className="min-w-0" padding="lg">
      <form
        aria-labelledby="pointage-entry-title"
        className="grid gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          void onIdentify();
        }}
      >
        <h2 id="pointage-entry-title" className="text-lg font-semibold">
          Saisissez votre code de pointage
        </h2>
        <p role="status" aria-live="polite" aria-atomic="true">
          {pending
            ? 'Identification en cours…'
            : ended
              ? 'Interaction terminée sur cet appareil'
              : ''}
        </p>
        <fieldset
          disabled={pending}
          aria-busy={pending}
          className="grid min-w-0 gap-6"
        >
          <FormField
            label={
              <label htmlFor="pointage-credential" className="font-medium">
                Code de pointage
              </label>
            }
          >
            <Input
              id="pointage-credential"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              minLength={8}
              maxLength={8}
              pattern="[0-9]{8}"
              required
              size="lg"
              value={pin}
              onChange={(event) => onPinChange(event.target.value)}
            />
          </FormField>
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={pending || !/^[0-9]{8}$/u.test(pin)}
          >
            S’identifier
          </Button>
        </fieldset>
      </form>
    </Card>
  );
}
