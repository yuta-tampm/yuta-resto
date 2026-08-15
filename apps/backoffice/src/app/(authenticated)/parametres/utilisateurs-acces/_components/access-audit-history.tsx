import type {
  ManageableEstablishment,
  OrganizationUser,
} from '@yuta/contracts/cloud-admin';
import type { AccessAuditItem } from '@yuta/db-cloud';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Panel,
  SimpleTable,
  SimpleTableBody,
  SimpleTableCell,
  SimpleTableHead,
  SimpleTableHeader,
  SimpleTableRow,
} from '@yuta/ui';
import { ChevronLeft, ChevronRight, Filter, History } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  accessAuditActionLabels,
  buildAccessAuditHref,
  type AccessAuditQuery,
} from '../access-audit-model';
import { loadAccessAuditHistory } from '../access-audit-loader';
import { AccessAuditRetryButton } from './access-audit-retry-button';
import { getMembershipStatusLabel, roleLabels } from '../user-access-model';

export async function AccessAuditHistory({
  tenant,
  establishments,
  users,
  query,
}: {
  tenant: TenantContext;
  establishments: ManageableEstablishment[];
  users: OrganizationUser[];
  query: AccessAuditQuery;
}) {
  let page;
  try {
    page = await loadAccessAuditHistory({
      tenant,
      allowedEstablishmentIds: establishments.map(({ id }) => id),
      query,
    });
  } catch (error: unknown) {
    console.error('Access audit history read failed.', error);
    return (
      <Panel
        id="historique-acces"
        title="Historique des accès"
        description="Visible uniquement par les propriétaires."
        bodyClassName="p-4"
      >
        <ErrorState
          title="Historique indisponible"
          description="L'historique des accès ne peut pas être chargé pour le moment."
          action={<AccessAuditRetryButton />}
        />
      </Panel>
    );
  }

  return (
    <Panel
      id="historique-acces"
      title="Historique des accès"
      description="Créations, rattachements et modifications d'accès. Visible uniquement par les propriétaires."
      bodyClassName="gap-4 p-4"
    >
      <AccessAuditFilters
        users={users}
        establishments={establishments}
        query={query}
      />

      {page.items.length === 0 ? (
        <EmptyState
          icon={<History className="h-6 w-6" />}
          title="Aucun événement d'accès"
          description={
            hasFilters(query)
              ? 'Aucun événement ne correspond aux filtres sélectionnés.'
              : "Aucune modification d'accès n'a encore été enregistrée."
          }
        />
      ) : (
        <>
          <div className="hidden rounded-lg border border-border-default md:block">
            <SimpleTable>
              <SimpleTableHeader>
                <SimpleTableRow>
                  <SimpleTableHead>Date et heure</SimpleTableHead>
                  <SimpleTableHead>Personne à l'origine</SimpleTableHead>
                  <SimpleTableHead>Action</SimpleTableHead>
                  <SimpleTableHead>Utilisateur concerné</SimpleTableHead>
                  <SimpleTableHead>Établissement</SimpleTableHead>
                  <SimpleTableHead>Rôle avant</SimpleTableHead>
                  <SimpleTableHead>Rôle après</SimpleTableHead>
                  <SimpleTableHead>Statut avant</SimpleTableHead>
                  <SimpleTableHead>Statut après</SimpleTableHead>
                </SimpleTableRow>
              </SimpleTableHeader>
              <SimpleTableBody>
                {page.items.map((item) => (
                  <AccessAuditTableRow
                    key={item.id}
                    item={item}
                    timezone={tenant.timezone}
                  />
                ))}
              </SimpleTableBody>
            </SimpleTable>
          </div>

          <div className="grid gap-3 md:hidden">
            {page.items.map((item) => (
              <AccessAuditCard
                key={item.id}
                item={item}
                timezone={tenant.timezone}
              />
            ))}
          </div>
        </>
      )}

      {(query.cursor || page.nextCursor) && (
        <nav
          className="flex flex-wrap justify-between gap-2 border-t border-border-default pt-4"
          aria-label="Pagination de l'historique des accès"
        >
          {query.cursor ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={buildAccessAuditHref(query)}>
                <ChevronLeft className="h-4 w-4" />
                Revenir au début
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {page.nextCursor && (
            <Button asChild variant="secondary" size="sm">
              <Link href={buildAccessAuditHref(query, page.nextCursor)}>
                Événements suivants
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </nav>
      )}
    </Panel>
  );
}

function AccessAuditFilters({
  users,
  establishments,
  query,
}: {
  users: OrganizationUser[];
  establishments: ManageableEstablishment[];
  query: AccessAuditQuery;
}) {
  return (
    <form
      action="/parametres/utilisateurs-acces#historique-acces"
      method="get"
      className="grid gap-3 rounded-lg border border-border-default bg-surface-muted p-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end"
      aria-label="Filtres de l'historique des accès"
    >
      <AuditSelect
        id="audit-user"
        name="auditUser"
        label="Utilisateur concerné"
        defaultValue={query.subjectUserId}
      >
        <option value="">Tous les utilisateurs</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} — {user.email ?? 'sans e-mail'}
          </option>
        ))}
      </AuditSelect>

      <AuditSelect
        id="audit-establishment"
        name="auditEstablishment"
        label="Établissement"
        defaultValue={query.establishmentId}
      >
        <option value="">Tous les établissements</option>
        {establishments.map((establishment) => (
          <option key={establishment.id} value={establishment.id}>
            {establishment.name}
          </option>
        ))}
      </AuditSelect>

      <AuditSelect
        id="audit-action"
        name="auditAction"
        label="Type d'action"
        defaultValue={query.action}
      >
        <option value="">Toutes les actions</option>
        {Object.entries(accessAuditActionLabels).map(([action, label]) => (
          <option key={action} value={action}>
            {label}
          </option>
        ))}
      </AuditSelect>

      <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-1">
        <Button type="submit" variant="secondary" size="sm">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
        {hasFilters(query) && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/parametres/utilisateurs-acces#historique-acces">
              Réinitialiser
            </Link>
          </Button>
        )}
      </div>
    </form>
  );
}

function AuditSelect({
  id,
  name,
  label,
  defaultValue,
  children,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="grid gap-1.5 text-sm font-semibold text-primary"
    >
      {label}
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ''}
        className="h-10 min-w-0 rounded-lg border border-border-default bg-surface px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        {children}
      </select>
    </label>
  );
}

function AccessAuditTableRow({
  item,
  timezone,
}: {
  item: AccessAuditItem;
  timezone: string;
}) {
  return (
    <SimpleTableRow>
      <SimpleTableCell className="whitespace-nowrap">
        <AuditDate value={item.createdAt} timezone={timezone} />
      </SimpleTableCell>
      <SimpleTableCell>
        <Identity name={item.actor.name} email={item.actor.email} />
      </SimpleTableCell>
      <SimpleTableCell>
        <Badge tone="info" variant="soft" size="sm">
          {accessAuditActionLabels[item.action]}
        </Badge>
      </SimpleTableCell>
      <SimpleTableCell>
        <Identity name={item.subject.name} email={item.subject.email} />
      </SimpleTableCell>
      <SimpleTableCell>{establishmentLabel(item)}</SimpleTableCell>
      <SimpleTableCell>{roleLabel(item.previousRole)}</SimpleTableCell>
      <SimpleTableCell>{roleLabel(item.nextRole)}</SimpleTableCell>
      <SimpleTableCell>{statusLabel(item.previousStatus)}</SimpleTableCell>
      <SimpleTableCell>{statusLabel(item.nextStatus)}</SimpleTableCell>
    </SimpleTableRow>
  );
}

function AccessAuditCard({
  item,
  timezone,
}: {
  item: AccessAuditItem;
  timezone: string;
}) {
  return (
    <Card padding="sm" className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <AuditDate value={item.createdAt} timezone={timezone} />
          <p className="mt-1 text-sm font-bold text-primary">
            {item.subject.name}
          </p>
        </div>
        <Badge tone="info" variant="soft" size="sm">
          {accessAuditActionLabels[item.action]}
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
        <AuditDetail label="Personne à l'origine" value={item.actor.name} />
        <AuditDetail label="Établissement" value={establishmentLabel(item)} />
        <AuditDetail label="Rôle avant" value={roleLabel(item.previousRole)} />
        <AuditDetail label="Rôle après" value={roleLabel(item.nextRole)} />
        <AuditDetail
          label="Statut avant"
          value={statusLabel(item.previousStatus)}
        />
        <AuditDetail
          label="Statut après"
          value={statusLabel(item.nextStatus)}
        />
      </dl>
    </Card>
  );
}

function AuditDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className="mt-0.5 break-words font-medium text-primary">{value}</dd>
    </div>
  );
}

function Identity({ name, email }: { name: string; email: string | null }) {
  return (
    <div className="min-w-40">
      <p className="font-semibold text-primary">{name}</p>
      {email && <p className="text-xs text-muted">{email}</p>}
    </div>
  );
}

function AuditDate({ value, timezone }: { value: Date; timezone: string }) {
  return (
    <time
      dateTime={value.toISOString()}
      className="text-sm font-semibold text-primary"
    >
      {new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: timezone,
      }).format(value)}
    </time>
  );
}

function establishmentLabel(item: AccessAuditItem): string {
  return item.establishments.length > 0
    ? item.establishments.map(({ name }) => name).join(', ')
    : 'Non disponible';
}

function roleLabel(role: TenantRole | null): string {
  return role ? roleLabels[role] : 'Non enregistré';
}

function statusLabel(status: AccessAuditItem['previousStatus']): string {
  return status ? getMembershipStatusLabel(status) : 'Non enregistré';
}

function hasFilters(query: AccessAuditQuery): boolean {
  return Boolean(query.subjectUserId || query.establishmentId || query.action);
}
