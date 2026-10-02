export function isFormalitesReadPrototypeEnabled(
  nodeEnvironment: string | undefined = process.env.NODE_ENV,
  configuredValue: string | undefined = process.env
    .BACKOFFICE_PERSONNEL_FORMALITES_READ_PROTOTYPE_ENABLED,
): boolean {
  return nodeEnvironment === 'development' && configuredValue === 'true';
}
