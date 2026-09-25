import { createHmac } from 'node:crypto'

// api.clipless.dev calls this when finance pays a claim. Check the signature first.
export async function POST(req: Request) {
  const raw = await req.text()
  const expected = `sha256=${createHmac('sha256', process.env.CLIPLESS_SIGNING_SECRET ?? '').update(raw).digest('hex')}`
  if (req.headers.get('x-clipless-signature') !== expected) return new Response(null, { status: 401 })
  return Response.json({ recorded: true }) // becomes the action's result in the ledger
}
