import 'server-only';

export function isGoogleReplyPublicationEnabled(): boolean {
  return process.env.GOOGLE_REVIEW_PUBLICATION_ENABLED === 'true';
}
