'use client';

import type { AvailableTenant } from '@yuta/auth';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  cn,
} from '@yuta/ui';
import { usePathname } from 'next/navigation';
import { useActionState, useEffect, useRef } from 'react';
import {
  switchTenantAction,
  type TenantSwitchActionState,
} from '../../app/(authenticated)/actions';
import { submitTenantSwitch } from './tenant-switcher-submission';

const initialState: TenantSwitchActionState = { error: null };

export function TenantSwitcher({
  tenants,
  currentMembershipId,
  className,
}: {
  tenants: AvailableTenant[];
  currentMembershipId: string;
  className?: string;
}) {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const membershipFieldRef = useRef<HTMLInputElement>(null);
  const submissionRequestedRef = useRef(false);
  const [state, formAction, isPending] = useActionState(
    switchTenantAction,
    initialState,
  );
  const tenantsByOrganization = groupTenantsByOrganization(tenants);

  useEffect(() => {
    if (!isPending) submissionRequestedRef.current = false;
  }, [isPending, state]);

  function handleValueChange(targetMembershipId: string) {
    const submitted = submitTenantSwitch({
      currentMembershipId,
      targetMembershipId,
      pending: isPending || submissionRequestedRef.current,
      membershipField: membershipFieldRef.current,
      form: formRef.current,
    });
    if (submitted) submissionRequestedRef.current = true;
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className={cn('min-w-0', className)}
      aria-busy={isPending}
    >
      <input type="hidden" name="returnTo" value={pathname} />
      <input
        key={currentMembershipId}
        ref={membershipFieldRef}
        type="hidden"
        name="membershipId"
        defaultValue={currentMembershipId}
      />
      <div className="min-w-0">
        <Select
          value={currentMembershipId}
          onValueChange={handleValueChange}
          disabled={tenants.length < 2 || isPending}
          required
        >
          <SelectTrigger
            aria-label="Établissement actif"
            className={cn(
              'h-9 min-w-0 bg-surface',
              state.error && 'border-status-danger',
            )}
          >
            <SelectValue placeholder="Choisir un établissement" />
          </SelectTrigger>
          <SelectContent>
            {tenantsByOrganization.map((organization) => (
              <SelectGroup key={organization.id}>
                <SelectLabel>{organization.name}</SelectLabel>
                {organization.tenants.map((tenant) => (
                  <SelectItem
                    key={tenant.membershipId}
                    value={tenant.membershipId}
                  >
                    {tenant.establishmentName}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        {isPending && (
          <p className="mt-1 max-w-64 text-xs text-muted" role="status">
            Changement d’établissement…
          </p>
        )}
        {!isPending && state.error && (
          <p className="mt-1 max-w-64 text-xs text-status-danger" role="alert">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}

function groupTenantsByOrganization(tenants: AvailableTenant[]) {
  const organizations = new Map<
    string,
    { id: string; name: string; tenants: AvailableTenant[] }
  >();
  for (const tenant of tenants) {
    const organization = organizations.get(tenant.organizationId);
    if (organization) {
      organization.tenants.push(tenant);
    } else {
      organizations.set(tenant.organizationId, {
        id: tenant.organizationId,
        name: tenant.organizationName,
        tenants: [tenant],
      });
    }
  }
  return [...organizations.values()];
}
