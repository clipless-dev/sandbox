// The claim's three roles, and which stage of workflows/expense-claim.tsx each owns.
// Shared by the server (tokens) and the browser (the side nav).

export const ROLES = ['employee', 'manager', 'finance'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_INFO: Record<Role, { label: string; does: string; stage: string }> = {
  employee: { label: 'Employee', does: 'Files the claim', stage: 'claim' },
  manager: { label: 'Manager', does: 'Approves or sends it back', stage: 'review' },
  finance: { label: 'Finance', does: 'Pays it', stage: 'payout' },
}
