import type {
  LocalManagementReportOrder,
  LocalManagementReportsResponse,
} from '@yuta/contracts/local-pos';
import { formatEuros } from '@yuta/core';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconTile,
  PageHeader,
} from '@yuta/ui';
import {
  ArrowLeft,
  Banknote,
  CheckCheck,
  ClipboardList,
  Clock3,
  ExternalLink,
  ReceiptText,
} from 'lucide-react';
import Link from 'next/link';
import {
  formatReportServiceDay,
  formatReportTime,
  reportOrderStatusLabel,
  reportOrderStatusTone,
  reportOrderTypeLabel,
  reportPaymentModeLabel,
} from '../_lib/reports-presentation';
import { ReportsRefreshButton } from './ReportsRefreshButton';
import { ReportsPagination } from './ReportsPagination';

export function ReportsView({
  report,
}: {
  report: LocalManagementReportsResponse;
}) {
  const metricCards = [
    {
      label: 'Encaissé aujourd’hui',
      value: formatEuros(report.summary.paidRevenueCents),
      detail: 'Principal des paiements capturés pendant le service',
      icon: Banknote,
      tone: 'success' as const,
    },
    {
      label: 'Commandes payées',
      value: String(report.summary.paidOrderCount),
      detail: 'Commandes finales payées pendant le service',
      icon: CheckCheck,
      tone: 'info' as const,
    },
    {
      label: 'Commandes ouvertes',
      value: String(report.summary.openOrderCount),
      detail: 'Commandes non finales créées pendant le service',
      icon: Clock3,
      tone: 'warning' as const,
    },
  ];

  return (
    <div className="grid w-full gap-3 px-4 py-4 md:px-6">
      <Link
        href="/management"
        className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-status-success hover:underline focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la gestion
      </Link>

      <PageHeader
        eyebrow="Gestion locale"
        title="Rapports locaux"
        description="Vue opérationnelle du service local en cours"
        media={
          <IconTile tone="neutral">
            <ClipboardList className="h-5 w-5" />
          </IconTile>
        }
        actions={<ReportsRefreshButton />}
      />

      <section aria-labelledby="reports-service-title" className="grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="reports-service-title" className="text-lg font-black">
              Aujourd’hui
            </h2>
            <p className="text-sm font-semibold text-secondary">
              {formatReportServiceDay(report.serviceDay)}
            </p>
          </div>
          <Badge tone="neutral" variant="outline">
            Généré à {formatReportTime(report.generatedAt)}
          </Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {metricCards.map((metric) => {
            const MetricIcon = metric.icon;
            return (
              <Card key={metric.label} className="grid gap-4" padding="lg">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-secondary">
                    {metric.label}
                  </p>
                  <IconTile tone={metric.tone} size="sm">
                    <MetricIcon className="h-4 w-4" />
                  </IconTile>
                </div>
                <p className="text-3xl font-black tracking-tight">
                  {metric.value}
                </p>
                <p className="text-xs font-semibold text-muted">
                  {metric.detail}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="reports-orders-title" className="grid gap-3">
        <div>
          <h2
            id="reports-orders-title"
            tabIndex={-1}
            className="w-fit rounded text-lg font-black focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
          >
            Commandes du service
          </h2>
          <p className="text-sm font-semibold text-secondary">
            Commandes créées ou entièrement payées dans la fenêtre affichée
          </p>
        </div>

        {report.orders.length === 0 ? (
          <Card padding="none">
            <EmptyState
              icon={<ReceiptText className="h-10 w-10" />}
              title="Aucune commande dans cette activité"
              description="Aucune commande n’a été créée ou entièrement payée pendant ce service. Les indicateurs affichent les valeurs réelles."
            />
          </Card>
        ) : (
          <Card padding="none" className="overflow-hidden">
            <div className="hidden grid-cols-[1.1fr_1fr_0.75fr_0.85fr_0.7fr_auto] gap-4 border-b border-border-default bg-surface-muted px-5 py-3 text-xs font-black uppercase text-muted lg:grid">
              <span>Commande</span>
              <span>Service</span>
              <span>Statut</span>
              <span>Horaires</span>
              <span className="text-right">Total</span>
              <span className="sr-only">Action</span>
            </div>
            <div className="divide-y divide-border-default">
              {report.orders.map((order) => (
                <ReportOrderRow key={order.id} order={order} />
              ))}
            </div>
          </Card>
        )}

        <ReportsPagination pagination={report.pagination} />
      </section>
    </div>
  );
}

function ReportOrderRow({ order }: { order: LocalManagementReportOrder }) {
  return (
    <article className="grid gap-4 px-4 py-4 lg:grid-cols-[1.1fr_1fr_0.75fr_0.85fr_0.7fr_auto] lg:items-center lg:px-5">
      <div>
        <p className="font-black">{order.orderNumber}</p>
        <p className="text-xs font-semibold text-muted">Commande POS locale</p>
      </div>
      <div>
        <p className="font-bold">{order.tableLabel}</p>
        <p className="text-xs font-semibold text-muted">
          {reportOrderTypeLabel(order.orderType)} ·{' '}
          {reportPaymentModeLabel(order.paymentMode)}
        </p>
      </div>
      <div>
        <Badge tone={reportOrderStatusTone(order.status)}>
          {reportOrderStatusLabel(order.status)}
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-1 lg:gap-1">
        <div className="flex gap-1 lg:block">
          <dt className="font-semibold text-muted">Créée</dt>
          <dd className="font-bold">{formatReportTime(order.createdAt)}</dd>
        </div>
        <div className="flex gap-1 lg:block">
          <dt className="font-semibold text-muted">Payée</dt>
          <dd className="font-bold">{formatReportTime(order.paidAt)}</dd>
        </div>
      </dl>
      <p className="text-xl font-black lg:text-right">
        {formatEuros(order.totalCents)}
      </p>
      <Button asChild variant="secondary" className="min-h-11">
        <Link href={`/orders/${order.id}`}>
          <ExternalLink className="h-4 w-4" />
          Ouvrir
        </Link>
      </Button>
    </article>
  );
}
