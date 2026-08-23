export type EmployeeEditDraftSnapshot = {
  givenNames: string;
  familyName: string;
  position: string;
  qualification: string;
  employmentTermType: string;
  expectedEndDate: string;
  fixedTermReasonCode: string;
  workTimeCategory: string;
  contractWeeklyHours: string;
  contractWeeklyMinuteRemainder: string;
  entryDate: string;
};

export function hasEmployeeEditUnsavedChanges(
  initial: EmployeeEditDraftSnapshot,
  current: EmployeeEditDraftSnapshot,
): boolean {
  return (Object.keys(initial) as Array<keyof EmployeeEditDraftSnapshot>).some(
    (field) => initial[field] !== current[field],
  );
}
