import { Button } from '@yuta/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PosMobileFab, PosPageShell } from '../components/pos/PosPageShell';
import { posApi } from '../lib/pos-api';
import { EmptyOrders } from './_components/EmptyOrders';
import { HomeSecondaryActions } from './_components/HomeSecondaryActions';
import {
  DesktopOrderTable,
  MobileOrderList,
  TabletOrderList,
} from './_components/OrderLists';
import { OrdersHomeToolbar } from './_components/OrdersHomeToolbar';
import { OrdersPagination } from './_components/OrdersPagination';
import { parsePage, parseView } from './_lib/orders-home';

type OrdersHomePageProps = {
  searchParams: Promise<{
    view?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function OrdersHomePage({
  searchParams,
}: OrdersHomePageProps) {
  const { view, q, page } = await searchParams;
  const selectedView = parseView(view);
  const searchQuery = q?.trim() ?? '';
  const homeData = await posApi.listOrdersHome({
    view: selectedView,
    q: searchQuery,
    page: parsePage(page),
    limit: 50,
  });
  const orderRows = homeData.orders;
  return (
    <PosPageShell
      title="Commandes"
      description="Suivi des commandes du service"
      actions={
        <Button asChild variant="primary" size="lg">
          <Link href="/pos">
            <Plus className="h-4 w-4" />
            Nouvelle commande
          </Link>
        </Button>
      }
      secondaryActions={<HomeSecondaryActions />}
      subHeader={
        <OrdersHomeToolbar
          selectedView={selectedView}
          searchQuery={searchQuery}
          counts={homeData.counts}
        />
      }
      floatingAction={
        <PosMobileFab
          href="/pos"
          label="Nouvelle commande"
          icon={<Plus className="h-6 w-6" />}
        />
      }
      contentClassName="px-4 py-4"
      prominentHeader
    >
      <div className="w-full">
        {orderRows.length === 0 ? (
          <EmptyOrders />
        ) : (
          <>
            <MobileOrderList orders={orderRows} />
            <TabletOrderList orders={orderRows} />
            <DesktopOrderTable orders={orderRows} />
          </>
        )}
        {homeData.pagination.totalPages > 1 && (
          <OrdersPagination
            view={selectedView}
            searchQuery={searchQuery}
            pagination={homeData.pagination}
          />
        )}
      </div>
    </PosPageShell>
  );
}
