/**
 * Master seed script — runs all seed scripts in order.
 *
 * Usage:
 *   # Seed local (uses DATABASE_URL from .env)
 *   pnpm db:seed
 *
 *   # Seed production RDS
 *   pnpm db:seed:prod
 *
 * The prod command reads DATABASE_URL from .env.production in the api directory.
 * Create apps/api/.env.production with your RDS connection string:
 *
 *   DATABASE_URL="postgresql://postgres:PASSWORD@your-rds-host:5432/skillbrick"
 */
import { execSync } from 'child_process';
import * as path from 'path';

const scripts = [
  'seed.ts',
  'seed-community-skills.ts',
  'seed-reddit-skills.ts',
  'seed-platform-skills.ts',
];

const dir = __dirname;

for (const script of scripts) {
  const fullPath = path.join(dir, script);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${script}`);
  console.log('='.repeat(60));

  try {
    execSync(`npx tsx "${fullPath}"`, {
      stdio: 'inherit',
      cwd: path.resolve(dir, '../..'),
      env: process.env,
    });
  } catch (err) {
    console.error(`\nFailed on ${script}. Stopping.`);
    process.exit(1);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log('All seeds complete!');
console.log('='.repeat(60));
