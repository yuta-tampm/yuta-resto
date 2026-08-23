import { formatEuros } from '@yuta/core';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  cn,
} from '@yuta/ui';
import { CreditCard, List, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { v7 as uuidv7 } from 'uuid';
import { PosPageShell } from '../../../../components/pos/PosPageShell';
import { AllergyAlert } from '../../../../components/orders/AllergyAlert';
import { KitchenSendSuccessBoundary } from '../../_components/KitchenSendSuccessBoundary';
import { SendToKitchenButton } from '../../_components/SendToKitchenButton';
import { CategoryScroller } from './_components/CategoryScroller';
import { MenuItemBrowser } from './_components/MenuItemBrowser';
import { MobileOrderDialog } from './_components/MobileOrderDialog';
import { OrderItemsSendSuccess } from './_components/OrderItemsSendSuccess';
import {
  OrderItemDetails,
  OrderItemQuantityControls,
  type OrderItemPresentation,
} from './_components/OrderItemPresentation';
import {
  hasIncompleteVariantSelection,
  isIncompleteVariantSelection,
  kitchenSendFeedback,
} from './_lib/kitchen-send-validation';
import { buildComboCompletionSuggestionGroups } from './_lib/combo-completion-suggestions';
import {
  comboSuggestionDismissalToken,
  hiddenComboSuggestionKeys,
} from './_lib/combo-suggestion-visibility';
import { posApi } from '../../../../lib/pos-api';
import { allergySummaryFromSnapshots } from '../../../_pos-helpers';

type OrderItemsPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    category?: string;
    sendError?: string;
    hideComboSuggestions?: string;
  }>;
};

type CategoryTab = {
  id: string;
  name: string;
};

export default async function OrderItemsPage({
  params,
  searchParams,
}: OrderItemsPageProps) {
  const { orderId } = await params;
  const { category, sendError, hideComboSuggestions } = await searchParams;
  const paymentView = await posApi.getPaymentViewData(orderId);
  const { catalog } = paymentView;
  const order = paymentView.order;
  const categories = catalog.categories.filter((category) => category.isActive);
  const paidPayment = order.payments.find(
    (payment) => payment.status === 'paid',
  );
  const menuItemConfigs = catalog.categories.flatMap((category) =>
    category.items.map((item) => ({ ...item, category })),
  );
  const menuItemConfigById = new Map(
    menuItemConfigs.map((item) => [item.id, item]),
  );
  const instructionConfigByMenuItemId = new Map(
    menuItemConfigs.map((item) => [
      item.id,
      {
        ...item.instructionConfig,
        variantOptions: item.variantOptions,
      },
    ]),
  );
  const emptyInstructionConfig = {
    defaultOptions: [],
    additionalOptions: [],
    variantOptions: [],
  };
  const selectedCategoryId = category ?? 'all';
  const categoryTabs: CategoryTab[] = [
    { id: 'all', name: 'Toutes' },
    ...categories.map((categoryItem) => ({
      id: categoryItem.id,
      name: categoryItem.name,
    })),
  ];
  const items = catalog.categories
    .flatMap((category) => category.items)
    .filter(
      (item) =>
        item.isAvailable &&
        (selectedCategoryId === 'all' ||
          item.categoryId === selectedCategoryId),
    )
    .toSorted(
      (left, right) =>
        left.sortOrder - right.sortOrder ||
        left.name.localeCompare(right.name, 'fr-FR'),
    );
  const pendingItemCount = order.items.filter(
    (item) => item.status === 'pending',
  ).length;
  const itemsWithVariantPolicy = order.items.map((item) => ({
    ...item,
    requiredVariantQuantity:
      menuItemConfigById.get(item.menuItemId)?.requiredVariantQuantity ?? 0,
    variantOptionCodes:
      menuItemConfigById
        .get(item.menuItemId)
        ?.variantOptions.map(({ code }) => code) ?? [],
  }));
  const incompleteVariantSelection = hasIncompleteVariantSelection(
    itemsWithVariantPolicy,
  );
  const sendFeedback =
    pendingItemCount > 0
      ? kitchenSendFeedback(sendError, incompleteVariantSelection)
      : null;
  const canEditItems =
    order.status !== 'paid' &&
    order.status !== 'cancelled' &&
    order.paymentMode === 'single' &&
    !paidPayment;
  const canSendToKitchen =
    order.status !== 'paid' &&
    order.status !== 'cancelled' &&
    pendingItemCount > 0 &&
    !incompleteVariantSelection;
  const activeOrderItems = order.items.filter(
    (item) => item.status !== 'cancelled',
  );
  const allComboSuggestionGroups = buildComboCompletionSuggestionGroups({
    canEditItems,
    orderItems: activeOrderItems.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      unitPriceCentsSnapshot: item.unitPriceCentsSnapshot,
      quantity: item.quantity,
      createdAt: item.createdAt,
    })),
    comboRules: paymentView.activeComboRules,
    catalogCategories: catalog.categories,
  });
  const hiddenComboKeys = hiddenComboSuggestionKeys(hideComboSuggestions);
  const comboSuggestionGroups = allComboSuggestionGroups.filter(
    (group) => !hiddenComboKeys.has(group.dismissalKey),
  );
  const comboSuggestionDismissal = comboSuggestionDismissalToken(
    allComboSuggestionGroups,
    hideComboSuggestions,
  );
  const requiredInstructionItemIds = new Set(
    itemsWithVariantPolicy
      .filter((item) => item.status !== 'cancelled')
      .filter(isIncompleteVariantSelection)
      .map((item) => item.id),
  );
  const pendingAllergyWarnings = order.items
    .filter(
      (item) =>
        item.status === 'pending' &&
        item.hasAllergy &&
        !item.allergyAcknowledgedAt,
    )
    .map((item) => ({
      itemName: item.itemNameSnapshot,
      allergyNote: allergySummaryFromSnapshots(
        item.selectedAllergens,
        item.allergySeverity,
        item.allergyNote,
      ),
    }));
  const orderItemPresentations: OrderItemPresentation[] = activeOrderItems.map(
    (item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.itemNameSnapshot,
      note: item.note,
      quickInstructions: item.quickInstructions,
      selectedVariants: item.selectedVariants,
      instructionConfig:
        instructionConfigByMenuItemId.get(item.menuItemId) ??
        emptyInstructionConfig,
      orderingPolicy:
        menuItemConfigById.get(item.menuItemId)?.orderingPolicy ?? 'merge',
      requiredVariantQuantity:
        menuItemConfigById.get(item.menuItemId)?.requiredVariantQuantity ?? 0,
      hasAllergy: item.hasAllergy,
      allergenCodes: item.allergenCodes,
      allergySeverity: item.allergySeverity,
      allergyNote: item.allergyNote,
      allergyDisplay: allergySummaryFromSnapshots(
        item.selectedAllergens,
        item.allergySeverity,
        item.allergyNote,
      ),
      totalLabel: formatEuros(item.unitPriceCentsSnapshot * item.quantity),
      isPending: item.status === 'pending',
      requiresAttention: requiredInstructionItemIds.has(item.id),
      statusLabel: orderItemStatusLabel(item.status),
    }),
  );

  const successContent = (
    <PosPageShell
      title={order.tableLabel}
      description={order.orderNumber}
      contentClassName="p-0"
    >
      <OrderItemsSendSuccess orderNumber={order.orderNumber} />
    </PosPageShell>
  );

  return (
    <KitchenSendSuccessBoundary successContent={successContent}>
      <PosPageShell
        title={order.tableLabel}
        description={order.orderNumber}
        actions={
          <Button asChild variant="secondary" className="h-11">
            <Link href={`/orders/${order.id}/payment`}>
              <CreditCard className="h-4 w-4" />
              Paiement
            </Link>
          </Button>
        }
        contentClassName="p-0 lg:overflow-hidden"
      >
        <div className="flex min-h-full min-w-0 flex-col lg:h-full lg:min-h-0">
          {sendFeedback && (
            <Alert tone="danger" className="m-4 mb-0 shrink-0" role="alert">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>{sendFeedback.title}</AlertTitle>
              <AlertDescription>{sendFeedback.description}</AlertDescription>
            </Alert>
          )}
          {order.hasAllergy && (
            <AllergyAlert
              allergyNote={order.allergyNote}
              acknowledged={Boolean(order.allergyAcknowledgedAt)}
              className="m-4 mb-0 shrink-0"
            />
          )}
          <div className="grid min-h-0 min-w-0 flex-1 content-start overflow-x-clip lg:grid-cols-[190px_minmax(0,1fr)_360px] lg:grid-rows-[minmax(0,1fr)] lg:content-stretch lg:gap-3 lg:bg-canvas lg:p-3 2xl:grid-cols-[220px_minmax(0,1fr)_440px] 2xl:gap-4 2xl:p-4">
            <aside className="sticky top-0 z-20 min-w-0 overflow-hidden border-b border-border-default bg-white lg:static lg:z-auto lg:flex lg:min-h-0 lg:flex-col lg:rounded-xl lg:border">
              <div className="hidden px-5 pb-4 pt-5 lg:block">
                <h2 className="text-sm font-black text-primary/65">
                  Catégories
                </h2>
              </div>
              <CategoryScroller
                categories={categoryTabs}
                orderId={order.id}
                selectedCategoryId={selectedCategoryId}
                comboSuggestionDismissal={comboSuggestionDismissal}
              />
            </aside>
            <section className="min-w-0 overflow-hidden border-b border-border-default bg-white lg:flex lg:min-h-0 lg:flex-col lg:rounded-xl lg:border">
              <MenuItemBrowser
                orderId={order.id}
                canEditItems={canEditItems}
                items={items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  priceLabel: formatEuros(item.priceCents),
                  selectedQuantity: activeOrderItems
                    .filter((orderItem) => orderItem.menuItemId === item.id)
                    .reduce(
                      (total, orderItem) => total + orderItem.quantity,
                      0,
                    ),
                }))}
                comboSuggestionGroups={comboSuggestionGroups.map((group) => ({
                  ...group,
                  items: group.items.map((item) => ({
                    ...item,
                    priceLabel: formatEuros(item.priceCents),
                  })),
                }))}
              />

              <MobileOrderDialog
                orderId={order.id}
                canEditItems={canEditItems}
                canSendToKitchen={canSendToKitchen}
                sendIdempotencyKey={uuidv7()}
                hasAllergy={order.hasAllergy}
                allergyNote={order.allergyNote}
                allergyAcknowledged={Boolean(order.allergyAcknowledgedAt)}
                itemAllergyWarnings={pendingAllergyWarnings}
                allergyOptions={catalog.instructionSettings.allergenOptions}
                items={orderItemPresentations}
                subtotalLabel={formatEuros(order.subtotalCents)}
                discountLabel={
                  order.discountCents > 0
                    ? `-${formatEuros(order.discountCents)}`
                    : formatEuros(0)
                }
                totalLabel={formatEuros(order.totalCents)}
              />
            </section>

            <aside className="hidden min-h-0 overflow-hidden bg-white lg:flex lg:flex-col lg:rounded-xl lg:border lg:border-border-default">
              <div className="flex items-center justify-between gap-3 px-5 py-5 xl:px-6">
                <h2 className="text-xl font-black">Commande actuelle</h2>
                <Badge tone={pendingItemCount > 0 ? 'success' : 'neutral'}>
                  {pendingItemCount > 0
                    ? 'En attente'
                    : orderStatusLabel(order.status)}
                </Badge>
              </div>
              <div className="grid min-h-0 flex-1 content-start overflow-y-auto px-5 xl:px-6">
                {activeOrderItems.length === 0 ? (
                  <p className="rounded-lg border border-border-default bg-canvas p-3 text-sm font-semibold text-primary/55">
                    Aucun article pour le moment.
                  </p>
                ) : (
                  orderItemPresentations.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'grid gap-1 border-b px-0 py-4 transition-colors last:border-b-0',
                        requiredInstructionItemIds.has(item.id)
                          ? 'rounded-lg border border-status-danger-border bg-status-danger-soft px-3'
                          : 'border-border-default',
                      )}
                    >
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2">
                        <OrderItemQuantityControls
                          orderId={order.id}
                          item={item}
                          canEditItems={canEditItems}
                        />
                        <OrderItemDetails
                          item={item}
                          orderId={order.id}
                          canEditItems={canEditItems}
                          allergyOptions={
                            catalog.instructionSettings.allergenOptions
                          }
                          truncateName
                        />
                        <p className="font-black">{item.totalLabel}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mx-6 my-4 border-t border-border-default" />

              <div className="grid gap-3 px-6 pb-6">
                <AmountRow label="Sous-total" value={order.subtotalCents} />
                <AmountRow label="Remise" value={-order.discountCents} />
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-lg font-black">Total</span>
                  <span className="text-xl font-black">
                    {formatEuros(order.totalCents)}
                  </span>
                </div>
                <div className="mt-3 border-t border-border-default" />
                <div className="hidden lg:block">
                  <SendToKitchenButton
                    orderId={order.id}
                    idempotencyKey={uuidv7()}
                    disabled={!canSendToKitchen}
                    hasAllergy={order.hasAllergy}
                    allergyNote={order.allergyNote}
                    allergyAcknowledged={Boolean(order.allergyAcknowledgedAt)}
                    itemAllergyWarnings={pendingAllergyWarnings}
                    label="Envoyer en cuisine"
                    icon="chef"
                    variant="primary"
                    className="h-11"
                    fullWidth
                    showSuccessOnCompletion
                  />
                </div>
                <Button asChild variant="secondary" className="h-11">
                  <Link href={`/orders/${order.id}`}>
                    <List className="h-4 w-4" />
                    Voir détails
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </PosPageShell>
    </KitchenSendSuccessBoundary>
  );
}

function AmountRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="font-semibold text-primary/60">{label}</span>
      <span className="font-black">
        {value < 0 ? '-' : ''}
        {formatEuros(Math.abs(value))}
      </span>
    </div>
  );
}

function orderItemStatusLabel(
  status: 'pending' | 'sent' | 'preparing' | 'ready' | 'served' | 'cancelled',
): string {
  const labels = {
    pending: 'À envoyer',
    sent: 'Envoyé',
    preparing: 'En préparation',
    ready: 'Prêt',
    served: 'Servi',
    cancelled: 'Annulé',
  } satisfies Record<typeof status, string>;

  return labels[status];
}

function orderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    preparing: 'En préparation',
    ready: 'Prête',
    served: 'Servie',
    paid: 'Payée',
    cancelled: 'Annulée',
  };

  return labels[status] ?? status;
}
