import { formatEuros } from '@yuta/core';

export function AmountRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="font-semibold text-primary/65">{label}</span>
      <span className="font-bold">
        {value < 0 ? '-' : ''}
        {formatEuros(Math.abs(value))}
      </span>
    </div>
  );
}
