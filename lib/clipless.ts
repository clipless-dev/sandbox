import 'server-only'

// This app's calls to api.clipless.dev. They run on the server only: the API key
// never reaches a browser, which gets a token for one claim and one role instead.

export const CLIPLESS_URL = process.env.CLIPLESS_URL || 'https://api.clipless.dev'

export const ROLES = ['employee', 'manager', 'finance'] as const
export type Role = (typeof ROLES)[number]

async function call(path: string, body?: object) {
  const res = await fetch(`${CLIPLESS_URL}/api/v1${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${process.env.CLIPLESS_API_KEY}`, 'content-type': 'application/json' },
    body: body && JSON.stringify(body),
    cache: 'no-store',
  })
  return res.json()
}

export async function listClaims(): Promise<{ session: string; status: string; currentRole: string | null }[]> {
  return (await call('/workflows/expense_claim_v1/sessions')).sessions
}

/** Start a claim; returns its id. */
export async function startClaim(): Promise<string> {
  return (await call('/workflows/expense_claim_v1/sessions', { role: 'role:employee' })).session
}

/** A token for one person on one claim, minted when their page opens. */
export async function tokenFor(claim: string, role: Role): Promise<string> {
  return (await call(`/sessions/${claim}/tokens`, { role: `role:${role}` })).token
}
