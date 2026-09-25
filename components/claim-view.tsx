'use client'

// A claim, with the roles down the side and the chosen role's form beside them.
// All three roles are mounted at once, each with its own token and live store, and
// only the chosen one is shown: switching is instant, and every role stays up to
// date. (This sandbox lets anyone play every role. A real app gives each person a
// page for their own role only.) The side nav reads whose turn it is from the
// store, so it moves when the claim does.

import type { WorkflowStore } from '@clipless/react'
import { Avatar, Box, Flex, Link, Text } from '@radix-ui/themes'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { type MouseEvent, useMemo, useState, useSyncExternalStore } from 'react'
import { ROLE_INFO, ROLES, type Role } from '@/lib/roles'
import { RoleWorkflow } from './role-workflow'

const noStore = () => () => {}

/** The role whose stage is open, or null (not loaded yet, or the claim is finished). */
function useTurn(store: WorkflowStore | null): Role | null {
  const snap = useSyncExternalStore(store?.subscribe ?? noStore, () => store?.getSnapshot() ?? null, () => null)
  if (!snap || snap.state.status === 'completed' || snap.state.status === 'expired') return null
  return ROLES.find((r) => ROLE_INFO[r].stage === snap.state.currentStageId) ?? null
}

/** Switch role in place: the URL changes (Next picks up pushState), nothing reloads. */
function switchTo(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  window.history.pushState(null, '', href)
}

function RoleNav({ claim, role, turn }: { claim: string; role: Role; turn: Role | null }) {
  return (
    <Flex asChild direction="column" gap="1">
      <nav aria-label="Roles">
        <Text size="1" weight="bold" color="gray" mb="2" ml="3" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Open this claim as
        </Text>
        {ROLES.map((r) => {
          const info = ROLE_INFO[r]
          const active = r === role
          return (
            <a
              key={r}
              href={`/claims/${claim}/${r}`}
              onClick={(e) => switchTo(e, `/claims/${claim}/${r}`)}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'block',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-3)',
                border: `1px solid ${active ? 'var(--accent-8)' : 'transparent'}`,
                background: active ? 'var(--accent-a3)' : undefined,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Flex gap="3" align="center">
                <Avatar fallback={info.label[0]} color={active ? undefined : 'gray'} variant={active ? 'solid' : 'soft'} radius="full" />
                <Box>
                  <Text as="div" size="2" weight="bold">
                    {info.label}
                  </Text>
                  <Text as="div" size="1" color="gray">
                    {info.does}
                  </Text>
                  {turn === r ? (
                    <Text as="div" size="1" color="green" mt="1">
                      ● {active ? 'Your turn' : 'Their turn'}
                    </Text>
                  ) : null}
                </Box>
              </Flex>
            </a>
          )
        })}
        <Link asChild size="1" color="gray" mt="3" ml="3">
          <NextLink href="/">← All claims</NextLink>
        </Link>
      </nav>
    </Flex>
  )
}

export function ClaimView({
  claim,
  role: initialRole,
  tokens,
  serverUrl,
}: {
  claim: string
  role: Role
  /** A token per role for this claim. */
  tokens: Record<Role, string>
  serverUrl: string
}) {
  // The URL is the source of truth, so Back and Forward switch roles too.
  const last = usePathname().split('/').pop()
  const role = ROLES.find((r) => r === last) ?? initialRole
  const [stores, setStores] = useState<Partial<Record<Role, WorkflowStore>>>({})
  const onStoreReady = useMemo(
    () =>
      Object.fromEntries(
        ROLES.map((r) => [r, (store: WorkflowStore) => setStores((s) => ({ ...s, [r]: store }))]),
      ) as Record<Role, (store: WorkflowStore) => void>,
    [],
  )
  const turn = useTurn(stores[role] ?? null)
  return (
    <Flex gap="8" direction={{ initial: 'column', sm: 'row' }}>
      <Box width={{ sm: '240px' }} flexShrink="0">
        <RoleNav claim={claim} role={role} turn={turn} />
      </Box>
      <Box flexGrow="1" minWidth="0">
        <Text as="div" size="1" color="gray" mb="1">
          Claim <code>{claim.slice(0, 8)}</code>
        </Text>
        <Text as="div" size="6" weight="bold" mb="5">
          {ROLE_INFO[role].label}
        </Text>
        {ROLES.map((r) => (
          <div key={r} hidden={r !== role}>
            <RoleWorkflow role={r} runtimeToken={tokens[r]} serverUrl={serverUrl} onStoreReady={onStoreReady[r]} />
          </div>
        ))}
      </Box>
    </Flex>
  )
}
