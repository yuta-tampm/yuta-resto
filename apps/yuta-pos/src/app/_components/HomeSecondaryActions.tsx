import { Button } from '@yuta/ui';
import { ChefHat, Settings } from 'lucide-react';
import Link from 'next/link';

export function HomeSecondaryActions() {
  return (
    <>
      <Button asChild variant="secondary" size="lg" className="w-full">
        <Link href="/kitchen">
          <ChefHat className="h-4 w-4" />
          Cuisine
        </Link>
      </Button>
      <Button asChild variant="secondary" size="lg" className="w-full">
        <Link href="/management">
          <Settings className="h-4 w-4" />
          Gestion
        </Link>
      </Button>
    </>
  );
}
