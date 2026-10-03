'use client';

import type { LocalUser } from '@yuta/contracts/local-pos';
import {
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuta/ui';
import { useId, useState } from 'react';
import { roleLabel } from '../users-model';

export function UserFields({
  roles,
  user,
  includeStatus = false,
  protectActiveAdmin = false,
}: {
  roles: LocalUser['role'][];
  user?: LocalUser;
  includeStatus?: boolean;
  protectActiveAdmin?: boolean;
}) {
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();
  const statusId = useId();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState<LocalUser['role']>(
    user?.role ?? roles[0] ?? 'staff',
  );
  const [isActive, setIsActive] = useState(user?.isActive ?? true);

  return (
    <>
      <FormField label={<label htmlFor={nameId}>Nom</label>}>
        <Input
          id={nameId}
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={255}
          required
        />
      </FormField>
      <FormField
        label={<label htmlFor={emailId}>E-mail</label>}
        hint="Facultatif, uniquement local."
      >
        <Input
          id={emailId}
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={320}
        />
      </FormField>
      <FormField label={<label htmlFor={roleId}>Rôle</label>}>
        <input type="hidden" name="role" value={role} />
        <Select
          value={role}
          onValueChange={(value) => setRole(value as LocalUser['role'])}
        >
          <SelectTrigger id={roleId} className="min-h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((value) => (
              <SelectItem
                key={value}
                value={value}
                disabled={protectActiveAdmin && value !== 'admin'}
              >
                {roleLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      {includeStatus && (
        <FormField label={<label htmlFor={statusId}>État</label>}>
          <input
            type="hidden"
            name="isActive"
            value={isActive ? 'true' : 'false'}
          />
          <Select
            value={isActive ? 'active' : 'inactive'}
            onValueChange={(value) => setIsActive(value === 'active')}
          >
            <SelectTrigger id={statusId} className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive" disabled={protectActiveAdmin}>
                Inactif
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      )}
    </>
  );
}

export function PinInputField({
  name,
  label,
  hint,
}: {
  name: 'pin' | 'pinConfirmation';
  label: string;
  hint?: string;
}) {
  const id = useId();
  const [value, setValue] = useState('');

  return (
    <FormField label={<label htmlFor={id}>{label}</label>} hint={hint}>
      <Input
        id={id}
        name={name}
        type="password"
        inputMode="numeric"
        pattern="[0-9]{4,8}"
        minLength={4}
        maxLength={8}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required
      />
    </FormField>
  );
}
