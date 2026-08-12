#!/usr/bin/env node

// Resolves the current environment the same way EnvironmentService does, then loads the
// manifest and every configuration subject's defaults, without needing a TypeScript runtime.
// Run before promoting a branch: dev -> staging -> release -> main.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ENVIRONMENT_REGISTRY = {
  development: { branch: 'dev' },
  staging: { branch: 'staging' },
  release: { branch: 'release' },
  production: { branch: 'main' },
}

const CONFIG_SUBJECTS = ['site', 'analytics', 'mail', 'seo']
const MANIFEST_BY_KEY = {
  development: 'dev',
  staging: 'staging',
  release: 'release',
  production: 'main',
}

/**
 * Environment key matching an explicit APP_ENV value, either a key or a branch name
 * @param {string} candidate - Trimmed APP_ENV value
 * @return {string | undefined} - Matching key
 */

const keyOf = (candidate) => {
  if (candidate in ENVIRONMENT_REGISTRY) return candidate

  return Object.entries(ENVIRONMENT_REGISTRY).find(([, meta]) => meta.branch === candidate)?.[0]
}

const explicit = process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV
const current =
  (explicit && keyOf(explicit.trim())) ||
  (process.env.NODE_ENV === 'production' ? 'production' : 'development')

const readJson = (relativePath) => JSON.parse(readFileSync(join(ROOT, relativePath), 'utf8'))

const manifest = readJson(`src/configurations/admins/environments/${MANIFEST_BY_KEY[current]}.json`)

console.log(`Environment: ${current} (branch ${manifest.branch})`)

const missing = []

for (const subject of CONFIG_SUBJECTS) {
  const defaults = readJson(
    `src/configurations/admins/defaults/${subject}/${subject}.${current}.json`
  )
  const enabled = 'enabled' in defaults ? defaults.enabled : true

  console.log(`  ${subject}: ${enabled ? 'enabled' : 'disabled'}`)

  if (manifest.required.includes(subject) && !enabled) missing.push(subject)
}

if (missing.length > 0) {
  console.error(`\nRequired subjects disabled: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('\nEvery required subject is enabled.')
