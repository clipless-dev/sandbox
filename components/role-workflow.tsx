'use client'

// One role's part of the workflow, loaded on its own: the finance page never
// downloads the manager's form. The `?role=` imports must live in a client file,
// because Next drops the query when a server page imports a client module.

import type { WorkflowProps } from '@clipless/react'
import dynamic from 'next/dynamic'

const byRole = {
  employee: dynamic(() => import('@/workflows/expense-claim.tsx?role=employee')),
  manager: dynamic(() => import('@/workflows/expense-claim.tsx?role=manager')),
  finance: dynamic(() => import('@/workflows/expense-claim.tsx?role=finance')),
}

export function RoleWorkflow({ role, ...props }: Partial<WorkflowProps> & { role: keyof typeof byRole }) {
  const Workflow = byRole[role]
  return <Workflow {...props} />
}
