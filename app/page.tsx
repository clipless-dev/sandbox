import { Button, Heading, Link } from '@radix-ui/themes'
import NextLink from 'next/link'
import { listClaims, ROLES } from '@/lib/clipless'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const claims = await listClaims()
  return (
    <>
      <Heading mb="4">Expense claims</Heading>
      <form action="/claims/new" method="post">
        <Button type="submit">New claim</Button>
      </form>
      <ul>
        {claims.map((c) => (
          <li key={c.session}>
            <code>{c.session.slice(0, 8)}</code> {c.status}, with {c.currentRole ?? 'nobody'}:{' '}
            {ROLES.map((role) => (
              <Link key={role} asChild mr="2">
                <NextLink href={`/claims/${c.session}/${role}`}>{role}</NextLink>
              </Link>
            ))}
          </li>
        ))}
      </ul>
    </>
  )
}
