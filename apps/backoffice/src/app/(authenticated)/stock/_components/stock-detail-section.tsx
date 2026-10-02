import type { ReactNode } from 'react';

export function StockDetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-4">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}

export function StockDetailRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="grid grid-cols-2 gap-y-2 text-xs">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted">{label}</dt>
          <dd className="truncate text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
