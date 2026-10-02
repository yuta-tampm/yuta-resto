export function getResponseErrorMessage(result: unknown): string | null {
  return typeof result === 'object' &&
    result !== null &&
    'error' in result &&
    typeof result.error === 'object' &&
    result.error !== null &&
    'message' in result.error &&
    typeof result.error.message === 'string'
    ? result.error.message
    : null;
}
