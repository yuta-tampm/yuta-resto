export type EmployeeCreateDraftSnapshot = {
  givenNames: string;
  familyName: string;
  position: string;
  qualification: string;
  employmentTermType: string;
  workTimeCategory: string;
  entryDate: string;
  expectedEndDate: string;
  fixedTermReasonCode: string;
  contractWeeklyHours: string;
  contractWeeklyMinuteRemainder: string;
  duplicateReason: string;
};

export function hasEmployeeCreateUnsavedInput(
  draft: EmployeeCreateDraftSnapshot,
): boolean {
  return (
    draft.givenNames.trim().length > 0 ||
    draft.familyName.trim().length > 0 ||
    draft.position.trim().length > 0 ||
    draft.qualification.trim().length > 0 ||
    draft.employmentTermType !== 'indefinite' ||
    draft.workTimeCategory !== 'full_time' ||
    draft.entryDate.length > 0 ||
    draft.expectedEndDate.length > 0 ||
    draft.fixedTermReasonCode.length > 0 ||
    draft.contractWeeklyHours.length > 0 ||
    draft.contractWeeklyMinuteRemainder !== '0' ||
    draft.duplicateReason.trim().length > 0
  );
}
