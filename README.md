# Clipless sandbox

An expense claim in Next.js on [Clipless](https://clipless.dev): the employee files it, the manager
approves it or sends it back, finance pays it and your app hears about it by webhook.

The workflow is one file, [`workflows/expense-claim.tsx`](workflows/expense-claim.tsx). Each browser
gets only its own role's stages ([`next.config.ts`](next.config.ts),
[`components/role-workflow.tsx`](components/role-workflow.tsx)). The API key stays on the server
([`lib/clipless.ts`](lib/clipless.ts)); a page gets tokens for one claim only. Here it gets one per
role, so you can switch between them instantly; a real app gives each person a token for their own role.

## Try it

You need [Bun](https://bun.sh) and a Clipless **test key** (`cls_test_…`): request early access at
[clipless.dev](https://clipless.dev). Test sessions are free, and email only ever reaches your own
address, so nothing you try here reaches anyone else.

```bash
git clone https://github.com/clipless-dev/sandbox && cd sandbox
bun install
cp .env.example .env.local            # paste your key into CLIPLESS_API_KEY
bunx clipless secrets signing-secret  # paste what it prints into CLIPLESS_SIGNING_SECRET
```

Finance's payout calls this app's webhook, so the app needs a public address. In another terminal:

```bash
cloudflared tunnel --url http://localhost:3001   # or: ngrok http 3001
```

Put the address it prints, plus `/api/webhooks/clipless`, into `CLIPLESS_WEBHOOK_URL`. Then:

```bash
bun run deploy   # send the workflow to Clipless
bun run dev      # http://localhost:3001
```

Start a claim, then open it as the manager and as finance. `bun run sessions` lists every claim.

Anyone can play every role here. A real app checks who may act for a role before minting a token.

## Developing Clipless

With the Clipless repo checked out next to this one (`../formdsl`), run everything locally:

```bash
# In ../formdsl: the database and the server (port 3000)
docker compose up -d postgres && bun dev:server
# In ../formdsl/server: prints an API key and a signing secret
bun run dev-session
# Here: set CLIPLESS_URL=http://localhost:3000 in .env.local, then use the SDK built from ../formdsl
bun run sdk
```

A local server can call `http://localhost:3001` directly, so no tunnel is needed.
`bun run sdk` leaves `package.json` alone; a later `bun install` goes back to the npm release.
