import Link from 'next/link'
import { listClaims, ROLES } from '@/lib/clipless'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const claims = await listClaims()
  return (
    <>
      <h1>Expense claims</h1>
      <form action="/claims/new" method="post">
        <button type="submit">New claim</button>
      </form>
      <ul>
        {claims.map((c) => (
          <li key={c.session}>
            <code>{c.session.slice(0, 8)}</code> {c.status}, with {c.currentRole ?? 'nobody'}:{' '}
            {ROLES.map((role) => (
              <Link key={role} href={`/claims/${c.session}/${role}`}>
                {role}{' '}
              </Link>
            ))}
          </li>
        ))}
      </ul>
    </>
  )
}
