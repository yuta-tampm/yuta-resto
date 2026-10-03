'use server';
import {
  googleReplyPreviewInputSchema,
  googleReplyAttemptInputSchema,
  type GoogleReplyPreviewInput,
  type GoogleReplyAttemptInput,
  type GoogleReplyPreviewResponse,
  type GoogleReplyPublicationReceipt,
} from '@yuta/contracts/reputation';
import { GoogleReplyPublicationRepositoryError } from '@yuta/db-cloud';
import { requireReputationTenant } from '@/server/auth/session';
import { requireReputationPermission } from '@/server/auth/permissions';
import {
  previewGoogleReply,
  confirmGoogleReply,
  reconcileGoogleReply,
} from '@/server/reputation/google-reply-publication';
import { revalidatePath } from 'next/cache';

type ActionResult<T> = { value: T | null; error: string | null };
function message(error: unknown): string {
  if (error instanceof GoogleReplyPublicationRepositoryError) {
    const messages: Record<
      GoogleReplyPublicationRepositoryError['code'],
      string
    > = {
      FORBIDDEN: 'Vous ne pouvez pas publier cette réponse.',
      STALE_AUTHORITY:
        'La connexion ou votre accès a changé. Reconnectez-vous et préparez une nouvelle confirmation.',
      NO_REFERENCE:
        'La référence Google n’est plus disponible. Actualisez cet avis ou demandez au propriétaire de reconnecter Google.',
      VERSION_CHANGED:
        'Le brouillon a changé. Enregistrez puis vérifiez la nouvelle version.',
      PREVIEW_EXPIRED:
        'La confirmation a expiré. Vérifiez à nouveau la réponse.',
      UNRESOLVED:
        'Un envoi précédent reste à vérifier. Rapprochez son résultat avant de publier une autre version.',
      RECONCILE_REQUIRED:
        'Vérifiez d’abord le résultat Google. Toute nouvelle tentative nécessite une confirmation distincte.',
      TEXT_TOO_LONG:
        'Google limite la réponse à 4 096 octets UTF-8. Raccourcissez le brouillon sans perdre votre version enregistrée.',
    };
    return messages[error.code];
  }
  return 'L’opération Google est indisponible. Votre brouillon est conservé. Vérifiez le résultat avant de réessayer un envoi.';
}
export async function previewGoogleReplyAction(
  input: GoogleReplyPreviewInput,
): Promise<ActionResult<GoogleReplyPreviewResponse>> {
  const { tenant, session } = await requireReputationTenant();
  requireReputationPermission(tenant, 'reputation.reply.publish');
  const parsed = googleReplyPreviewInputSchema.safeParse(input);
  if (!parsed.success)
    return { value: null, error: 'La confirmation demandée n’est pas valide.' };
  try {
    return {
      value: await previewGoogleReply(tenant, session.id, parsed.data),
      error: null,
    };
  } catch (error: unknown) {
    return { value: null, error: message(error) };
  }
}
export async function confirmGoogleReplyAction(
  input: GoogleReplyAttemptInput,
): Promise<ActionResult<GoogleReplyPublicationReceipt>> {
  const { tenant, session } = await requireReputationTenant();
  requireReputationPermission(tenant, 'reputation.reply.publish');
  const parsed = googleReplyAttemptInputSchema.safeParse(input);
  if (!parsed.success)
    return { value: null, error: 'La confirmation demandée n’est pas valide.' };
  try {
    const value = await confirmGoogleReply(tenant, session.id, parsed.data);
    revalidatePath('/visibilite-reputation/avis');
    return { value, error: null };
  } catch (error: unknown) {
    return { value: null, error: message(error) };
  }
}
export async function reconcileGoogleReplyAction(
  input: GoogleReplyAttemptInput,
): Promise<ActionResult<GoogleReplyPublicationReceipt>> {
  const { tenant, session } = await requireReputationTenant();
  requireReputationPermission(tenant, 'reputation.reply.publish');
  const parsed = googleReplyAttemptInputSchema.safeParse(input);
  if (!parsed.success)
    return { value: null, error: 'La vérification demandée n’est pas valide.' };
  try {
    const value = await reconcileGoogleReply(tenant, session.id, parsed.data);
    revalidatePath('/visibilite-reputation/avis');
    return { value, error: null };
  } catch (error: unknown) {
    return { value: null, error: message(error) };
  }
}
