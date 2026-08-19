'use client';

import type {
  LocalPrintSettings,
  PrintFontSizePreset,
} from '@yuta/contracts/local-pos';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from '@yuta/ui';
import {
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Printer,
  Settings2,
  TriangleAlert,
} from 'lucide-react';
import { useActionState, useState } from 'react';
import {
  createTestPrintJobAction,
  savePrintSettingsAction,
  type PrintingActionState,
} from '../actions';

const initialState: PrintingActionState = { error: null, success: null };
const paddingOptions = Array.from({ length: 9 }, (_, value) => String(value));

export function PrintSettingsCard({
  settings,
}: {
  settings: LocalPrintSettings;
}) {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [kitchenEnabled, setKitchenEnabled] = useState(settings.kitchenEnabled);
  const [counterEnabled, setCounterEnabled] = useState(settings.counterEnabled);
  const [kitchenCopies, setKitchenCopies] = useState(
    String(settings.kitchenCopies),
  );
  const [counterCopies, setCounterCopies] = useState(
    String(settings.counterCopies),
  );
  const [fontSizePreset, setFontSizePreset] = useState<PrintFontSizePreset>(
    settings.fontSizePreset,
  );
  const [topPaddingLines, setTopPaddingLines] = useState(
    String(settings.topPaddingLines),
  );
  const [leftPaddingChars, setLeftPaddingChars] = useState(
    String(settings.leftPaddingChars),
  );
  const [bottomPaddingLines, setBottomPaddingLines] = useState(
    String(settings.bottomPaddingLines),
  );
  const [state, action, pending] = useActionState(
    savePrintSettingsAction,
    initialState,
  );

  return (
    <section className="grid gap-3 xl:grid-cols-2">
      <Card padding="none" className="overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left xl:hidden"
          aria-expanded={settingsExpanded}
          aria-controls="print-settings-content"
          onClick={() => setSettingsExpanded((expanded) => !expanded)}
        >
          <span className="flex items-center gap-2 font-black">
            <Settings2 className="h-4 w-4 text-secondary" />
            Paramètres des tickets
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              settingsExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div className="hidden items-center gap-2 px-4 py-3 font-black xl:flex">
          <Settings2 className="h-4 w-4 text-secondary" />
          Paramètres des tickets
        </div>

        <form
          id="print-settings-content"
          action={action}
          className={`${settingsExpanded ? 'grid' : 'hidden'} gap-4 border-t border-border-default p-4 xl:grid`}
        >
          <input
            type="hidden"
            name="kitchenEnabled"
            value={String(kitchenEnabled)}
          />
          <input
            type="hidden"
            name="counterEnabled"
            value={String(counterEnabled)}
          />
          <input type="hidden" name="kitchenCopies" value={kitchenCopies} />
          <input type="hidden" name="counterCopies" value={counterCopies} />
          <input type="hidden" name="fontSizePreset" value={fontSizePreset} />
          <input type="hidden" name="topPaddingLines" value={topPaddingLines} />
          <input
            type="hidden"
            name="leftPaddingChars"
            value={leftPaddingChars}
          />
          <input
            type="hidden"
            name="bottomPaddingLines"
            value={bottomPaddingLines}
          />

          <p className="text-sm text-secondary">
            Activez les tickets nécessaires. Au moins une destination doit
            rester active. Les tickets actifs sont coupés séparément sur l’EPSON
            TM-m30.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <PrintDestinationSwitch
              id="kitchen-printing-enabled"
              label="Impression CUISINE"
              description="Articles préparés en cuisine"
              checked={kitchenEnabled}
              disabled={kitchenEnabled && !counterEnabled}
              onCheckedChange={setKitchenEnabled}
            />
            <PrintDestinationSwitch
              id="counter-printing-enabled"
              label="Impression BAR"
              description="Commande complète pour le bar"
              checked={counterEnabled}
              disabled={counterEnabled && !kitchenEnabled}
              onCheckedChange={setCounterEnabled}
            />
          </div>

          <div className="grid items-end gap-3 md:grid-cols-3 xl:grid-cols-3">
            <FormField label="Copies Cuisine">
              <Select value={kitchenCopies} onValueChange={setKitchenCopies}>
                <SelectTrigger className="min-h-11 xl:min-h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 copie</SelectItem>
                  <SelectItem value="2">2 copies</SelectItem>
                  <SelectItem value="3">3 copies</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Copies BAR (commande complète)">
              <Select value={counterCopies} onValueChange={setCounterCopies}>
                <SelectTrigger className="min-h-11 xl:min-h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 copie</SelectItem>
                  <SelectItem value="2">2 copies</SelectItem>
                  <SelectItem value="3">3 copies</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Taille du texte">
              <Select
                value={fontSizePreset}
                onValueChange={(value) =>
                  setFontSizePreset(value as PrintFontSizePreset)
                }
              >
                <SelectTrigger className="min-h-11 xl:min-h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compacte</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid items-end gap-3 md:grid-cols-3 xl:grid-cols-3">
            <PaddingSelect
              label="Marge haute (lignes)"
              value={topPaddingLines}
              onValueChange={setTopPaddingLines}
            />
            <PaddingSelect
              label="Marge gauche (caractères)"
              value={leftPaddingChars}
              onValueChange={setLeftPaddingChars}
            />
            <PaddingSelect
              label="Marge basse (lignes)"
              value={bottomPaddingLines}
              onValueChange={setBottomPaddingLines}
            />
          </div>

          {state.error && (
            <Alert tone="danger">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.success && (
            <Alert tone="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{state.success}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={pending}
              className="min-h-11 xl:min-h-10"
            >
              Enregistrer les paramètres
            </Button>
          </div>
        </form>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="flex items-center gap-2 font-black">
            <Printer className="h-4 w-4 text-secondary" />
            Aperçu des tickets
          </span>
        </div>
        <div className="hidden grid-cols-2 gap-3 border-t border-border-default p-4 xl:grid">
          <TicketPreview
            title="CUISINE"
            subtitle={
              kitchenEnabled
                ? `${kitchenCopies} copie${kitchenCopies === '1' ? '' : 's'}`
                : 'Désactivée'
            }
            enabled={kitchenEnabled}
            preset={fontSizePreset}
            topPaddingLines={Number(topPaddingLines)}
            leftPaddingChars={Number(leftPaddingChars)}
            bottomPaddingLines={Number(bottomPaddingLines)}
          />
          <TicketPreview
            title="BAR — COMMANDE COMPLÈTE"
            subtitle={
              counterEnabled
                ? `${counterCopies} copie${counterCopies === '1' ? '' : 's'}`
                : 'Désactivée'
            }
            enabled={counterEnabled}
            preset={fontSizePreset}
            topPaddingLines={Number(topPaddingLines)}
            leftPaddingChars={Number(leftPaddingChars)}
            bottomPaddingLines={Number(bottomPaddingLines)}
          />
        </div>
        <div className="px-4 pb-4">
          <TestPrintControl />
        </div>
      </Card>
    </section>
  );
}

function PrintDestinationSwitch({
  id,
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-surface p-3">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block font-bold">{label}</span>
        <span className="mt-0.5 block text-xs text-secondary">
          {description}
        </span>
      </label>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-describedby={`${id}-status`}
      />
      <span id={`${id}-status`} className="sr-only">
        {checked ? 'Activée' : 'Désactivée'}
      </span>
    </div>
  );
}

function TestPrintControl() {
  const [state, action, pending] = useActionState(
    createTestPrintJobAction,
    initialState,
  );
  return (
    <div className="grid gap-3 border-t border-border pt-5">
      <div>
        <p className="font-bold">Test de l’imprimante</p>
        <p className="mt-1 text-sm text-secondary">
          Imprime une page avec accents, apostrophes, tirets, marges et coupe.
          Enregistrez d’abord les paramètres ci-dessus.
        </p>
      </div>
      {state.error && (
        <Alert tone="danger">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert tone="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{state.success}</AlertDescription>
        </Alert>
      )}
      <form action={action}>
        <Button
          type="submit"
          variant="secondary"
          loading={pending}
          className="min-h-11 xl:min-h-10"
        >
          <FlaskConical className="h-4 w-4" />
          Impression test
        </Button>
      </form>
    </div>
  );
}

function PaddingSelect({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <FormField label={label}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="min-h-11 xl:min-h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {paddingOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

function TicketPreview({
  title,
  subtitle,
  enabled,
  preset,
  topPaddingLines,
  leftPaddingChars,
  bottomPaddingLines,
}: {
  title: string;
  subtitle: string;
  enabled: boolean;
  preset: PrintFontSizePreset;
  topPaddingLines: number;
  leftPaddingChars: number;
  bottomPaddingLines: number;
}) {
  const itemClass =
    preset === 'large'
      ? 'text-xl font-black'
      : preset === 'compact'
        ? 'text-sm font-bold'
        : 'text-lg font-black';
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 ${enabled ? '' : 'opacity-50'}`}
      style={{
        paddingTop: `${16 + topPaddingLines * 4}px`,
        paddingLeft: `${16 + leftPaddingChars * 3}px`,
        paddingBottom: `${16 + bottomPaddingLines * 4}px`,
      }}
    >
      <p className="text-center text-xl font-black">{title}</p>
      <Separator className="my-3" />
      <p className="text-xs font-semibold uppercase text-secondary">
        {subtitle} · Papier 80 mm
      </p>
      <p className={`mt-3 ${itemClass}`}>2 × Exemple d’article</p>
      <p className="mt-1 text-sm text-secondary">&gt; Option ou remarque</p>
    </div>
  );
}
