#!/usr/bin/env node
/**
 * Simple version bumper - increments major version only
 * Usage: npm run version-bump
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagePath = join(__dirname, 'package.json');
const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));

// Extract current major version
const currentVersion = parseInt(pkg.version.split('.')[0]) || 0;
const newVersion = currentVersion + 1;

// Update version
pkg.version = `${newVersion}.0.0`;

// Write back to package.json
writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`✓ Version bumped: v${currentVersion} → v${newVersion}`);
console.log(`  Updated package.json to ${pkg.version}`);
