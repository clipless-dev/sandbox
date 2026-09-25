import { ClaimView } from '@/components/claim-view'
import { CLIPLESS_URL, ROLES, type Role, tokenFor } from '@/lib/clipless'

export const dynamic = 'force-dynamic'

// The sandbox lets anyone play every role, so the page gets a token for each and
// switching is instant. A real app checks that the signed-in person may act for a
// role, and mints a token for that role only.
export default async function ClaimPage({ params }: { params: Promise<{ id: string; role: Role }> }) {
  const { id, role } = await params
  const tokens = Object.fromEntries(
    await Promise.all(ROLES.map(async (r) => [r, await tokenFor(id, r)] as const)),
  ) as Record<Role, string>
  return <ClaimView claim={id} role={role} tokens={tokens} serverUrl={CLIPLESS_URL} />
}
