import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  YutaBrandMark,
} from '@yuta/ui';
import { ArrowLeft, ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOutManagementAction } from '../actions';

export function ManagementHeader({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  return (
    <header className="border-b border-primary bg-primary text-inverse shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/management"
          aria-label="Retour à la gestion locale"
          className="flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-primary"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface shadow-xs">
            <YutaBrandMark showName={false} iconClassName="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-normal text-inverse/55">
              YuTa POS
            </p>
            <p className="text-base font-black leading-tight md:text-lg">
              Gestion locale
            </p>
            <p className="hidden truncate text-xs font-semibold text-inverse/65 md:block">
              Connecté en tant que {userName} · {roleLabel(userRole)}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="min-h-11 min-w-11 border-neutral-600 px-0 text-inverse hover:bg-neutral-800 md:px-3 xl:min-h-10"
          >
            <Link href="/" aria-label="Retour au POS">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Retour au POS</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="min-h-11 border-neutral-600 text-inverse hover:bg-neutral-800 xl:min-h-10"
              >
                {shortRoleLabel(userRole)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              <DropdownMenuLabel className="normal-case">
                <span className="block truncate text-sm text-primary">
                  {userName}
                </span>
                <span className="mt-0.5 block text-xs font-medium normal-case text-muted">
                  {roleLabel(userRole)}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={signOutManagementAction}>
                <DropdownMenuItem asChild destructive>
                  <button
                    type="submit"
                    className="min-h-11 w-full cursor-pointer gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function shortRoleLabel(role: string): string {
  return role === 'admin' ? 'Admin' : 'Manager';
}

function roleLabel(role: string): string {
  return role === 'admin' ? 'Administrateur' : 'Manager';
}
