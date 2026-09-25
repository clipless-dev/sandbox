import { redirect } from 'next/navigation'
import { startClaim } from '@/lib/clipless'

export async function POST() {
  redirect(`/claims/${await startClaim()}/employee`)
}
