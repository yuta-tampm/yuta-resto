export function isPersonnelRegisterEnabled(
  nodeEnvironment: string | undefined = process.env.NODE_ENV,
): boolean {
  return nodeEnvironment === 'development';
}
