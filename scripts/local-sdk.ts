// bun run sdk — for developing Clipless itself: install the SDK built from
// ../engine instead of the npm release. It builds @clipless/react (which compiles
// the parts of core it needs into its own dist/), packs react/dist as npm would,
// installs the tarball, then puts package.json and bun.lock back as they were, so
// the repo never points at it. A later `bun install` returns to the npm release.

import { $ } from 'bun'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const react = resolve(root, '../engine/react')
const vendor = resolve(root, 'vendor')
mkdirSync(vendor, { recursive: true })

console.log('Building @clipless/react…')
await $`bun run build`.cwd(react).quiet()
// The package is react/dist: the build gives it its own package.json.
await $`bun pm pack --destination ${vendor}`.cwd(resolve(react, 'dist')).quiet()

const { version } = await Bun.file(resolve(react, 'package.json')).json()
const file = `clipless-react-${version}.tgz`
if (!existsSync(resolve(vendor, file))) throw new Error(`no ${file} in vendor/`)

const pkgFile = resolve(root, 'package.json')
const lockFile = resolve(root, 'bun.lock')
const pkgBefore = await Bun.file(pkgFile).text()
const lockBefore = (await Bun.file(lockFile).exists()) ? await Bun.file(lockFile).text() : null

try {
  const pkg = JSON.parse(pkgBefore)
  pkg.dependencies['@clipless/react'] = `file:./vendor/${file}`
  await Bun.write(pkgFile, JSON.stringify(pkg, null, 2))
  await $`bun install --force`.cwd(root)
} finally {
  await Bun.write(pkgFile, pkgBefore)
  if (lockBefore !== null) await Bun.write(lockFile, lockBefore)
}
console.log(`Installed @clipless/react ${version} from ../engine (package.json and bun.lock unchanged).`)
