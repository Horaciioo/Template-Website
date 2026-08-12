#!/usr/bin/env node

// Keeps guide/REGISTRE.md honest: every service, every declaration file and every
// feature flag must be named in it, and every service it names must still exist.
// A registry entry nobody maintains by hand drifts silently, this makes the drift fail CI.

import { readFileSync, readdirSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const ROOT = process.cwd()
const REGISTRE_PATH = join(ROOT, 'guide/REGISTRE.md')
const registre = readFileSync(REGISTRE_PATH, 'utf8')

/**
 * Recursive file listing
 * @param {string} directory - Directory to walk
 * @return {string[]} - Every file path found underneath
 */

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })

const nameWithoutExtension = (filePath) => basename(filePath, extname(filePath))

const issues = []

const serviceFiles = walk(join(ROOT, 'src/services')).filter((file) => file.endsWith('.ts'))

for (const file of serviceFiles) {
  const name = nameWithoutExtension(file)
  if (!registre.includes(name)) {
    issues.push(`Service "${name}" (${relative(ROOT, file)}) is missing from guide/REGISTRE.md`)
  }
}

const knownServiceNames = new Set(serviceFiles.map(nameWithoutExtension))
const mentionedServiceNames = registre.match(/\b[A-Z][A-Za-z0-9]*Service\b/g) ?? []

for (const name of new Set(mentionedServiceNames)) {
  if (!knownServiceNames.has(name)) {
    issues.push(`guide/REGISTRE.md references "${name}", which no longer exists under src/services`)
  }
}

const declarationFiles = walk(join(ROOT, 'src/declarations')).filter((file) => file.endsWith('.ts'))

for (const file of declarationFiles) {
  const name = basename(file)
  if (!registre.includes(name)) {
    issues.push(`Declaration "${name}" (${relative(ROOT, file)}) is missing from guide/REGISTRE.md`)
  }
}

const features = JSON.parse(readFileSync(join(ROOT, 'src/configurations/features.json'), 'utf8'))

for (const flag of Object.keys(features)) {
  if (!registre.includes(`→ ${flag}`)) {
    issues.push(
      `Feature flag "${flag}" (features.json) is missing its "→ ${flag}" reference in guide/REGISTRE.md`
    )
  }
}

if (issues.length > 0) {
  console.error(`guide/REGISTRE.md is out of sync (${issues.length}):\n`)
  issues.forEach((issue) => console.error(`  - ${issue}`))
  process.exit(1)
}

console.log('guide/REGISTRE.md is in sync with src/services, src/declarations and features.json.')
