import { RoleWorkflow } from '@/components/role-workflow'
import { CLIPLESS_URL, type Role, tokenFor } from '@/lib/clipless'

export const dynamic = 'force-dynamic'

// A real app checks here that the signed-in person may act for this role.
export default async function ClaimPage({ params }: { params: Promise<{ id: string; role: Role }> }) {
  const { id, role } = await params
  return <RoleWorkflow role={role} runtimeToken={await tokenFor(id, role)} serverUrl={CLIPLESS_URL} />
}
