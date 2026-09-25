// bun run sdk — for developing Clipless itself: install the SDK built from
// ../formdsl instead of the npm release. It builds @clipless/core and
// @clipless/react, packs them as npm would, installs the tarballs, then puts
// package.json and bun.lock back as they were, so the repo never points at them.
// A later `bun install` returns to the npm release.

import { $ } from 'bun'
import { mkdirSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const formdsl = resolve(root, '../formdsl')
const vendor = resolve(root, 'vendor')
mkdirSync(vendor, { recursive: true })

for (const pkg of ['core', 'react']) {
  console.log(`Building @clipless/${pkg}…`)
  await $`bun run build`.cwd(resolve(formdsl, pkg)).quiet()
  await $`bun pm pack --destination ${vendor}`.cwd(resolve(formdsl, pkg)).quiet()
}

const tarball = (name: string) => {
  const file = readdirSync(vendor)
    .filter((f) => f.startsWith(`clipless-${name}-`) && f.endsWith('.tgz'))
    .sort()
    .at(-1)
  if (!file) throw new Error(`no ${name} tarball in vendor/`)
  return `file:./vendor/${file}`
}

const pkgFile = resolve(root, 'package.json')
const lockFile = resolve(root, 'bun.lock')
const pkgBefore = await Bun.file(pkgFile).text()
const lockBefore = (await Bun.file(lockFile).exists()) ? await Bun.file(lockFile).text() : null

try {
  const pkg = JSON.parse(pkgBefore)
  pkg.dependencies['@clipless/react'] = tarball('react')
  // @clipless/react depends on @clipless/core: point that at the local one too.
  pkg.overrides = { ...pkg.overrides, '@clipless/core': tarball('core') }
  await Bun.write(pkgFile, JSON.stringify(pkg, null, 2))
  await $`bun install --force`.cwd(root)
} finally {
  await Bun.write(pkgFile, pkgBefore)
  if (lockBefore !== null) await Bun.write(lockFile, lockBefore)
}
console.log('Installed the SDK from ../formdsl (package.json and bun.lock unchanged).')
