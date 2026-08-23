type PendingOrderItemForKitchenValidation = {
  quantity: number;
  status: string;
  selectedVariants: Array<{ code: string; quantity: number }>;
  requiredVariantQuantity: number;
  variantOptionCodes: string[];
};

export type KitchenSendFeedback = {
  title: string;
  description: string;
};

export function hasIncompleteVariantSelection(
  items: PendingOrderItemForKitchenValidation[],
): boolean {
  return items.some(isIncompleteVariantSelection);
}

export function isIncompleteVariantSelection(
  item: PendingOrderItemForKitchenValidation,
): boolean {
  return (
    item.status === 'pending' &&
    (item.selectedVariants.some(
      ({ code }) => !item.variantOptionCodes.includes(code),
    ) ||
      (item.requiredVariantQuantity > 0 &&
        item.selectedVariants.reduce(
          (total, variant) => total + variant.quantity,
          0,
        ) !==
          item.quantity * item.requiredVariantQuantity))
  );
}

export function kitchenSendFeedback(
  errorCode: string | undefined,
  incompleteVariantSelection: boolean,
): KitchenSendFeedback | null {
  if (incompleteVariantSelection || errorCode === 'INVALID_VARIANT_QUANTITY') {
    return {
      title: 'Choix requis',
      description:
        'Ouvrez « Choisir les options » sous l’article signalé et complétez les choix requis avant l’envoi.',
    };
  }

  const messages: Record<string, KitchenSendFeedback> = {
    ALLERGY_ACKNOWLEDGEMENT_REQUIRED: {
      title: 'Confirmation allergie requise',
      description:
        'Confirmez les précautions allergie avant d’envoyer la commande.',
    },
    EMPTY_KITCHEN_SEND: {
      title: 'Aucun nouvel article',
      description: 'Ajoutez un article avant de l’envoyer en cuisine.',
    },
    INVALID_ORDER_STATUS: {
      title: 'Envoi impossible',
      description:
        'Cette commande est déjà payée ou annulée et ne peut plus être envoyée.',
    },
    IDEMPOTENCY_CONFLICT: {
      title: 'Envoi déjà traité',
      description: 'Actualisez la commande avant de réessayer.',
    },
    KITCHEN_SEND_FAILED: {
      title: 'Envoi impossible',
      description:
        'Le service local n’a pas pu envoyer la commande. Réessayez dans un instant.',
    },
  };

  return errorCode
    ? (messages[errorCode] ?? messages.KITCHEN_SEND_FAILED)
    : null;
}
