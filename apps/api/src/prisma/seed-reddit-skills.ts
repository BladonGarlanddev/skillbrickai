/**
 * Seed script for Reddit-sourced AI skills.
 * Run after the main seed.ts to add curated skills from Reddit prompt communities.
 *
 * Usage: npx ts-node apps/api/src/prisma/seed-reddit-skills.ts
 *
 * Sources: r/ChatGPTPromptGenius, r/PromptEngineering, r/ChatGPT, r/ClaudeAI,
 * and the awesome-chatgpt-prompts community (prompts.chat).
 *
 * This script assigns skills to existing seeded users (from seed.ts) in a
 * round-robin fashion and creates the associated tags and testedOn records.
 */
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

function generateSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

const prisma = new PrismaClient();

interface SkillData {
  name: string;
  description: string;
  content: string;
  domain: string;
  author: string;
  tags: string[];
  testedOn: string[];
}

async function main() {
  console.log('Seeding Reddit-sourced skills...');

  const dataPath = path.join(__dirname, 'seed-reddit-skills-data.json');
  const skills: SkillData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Get existing users to assign as authors
  const users = await prisma.user.findMany({ select: { id: true, username: true } });
  if (users.length === 0) {
    console.error('No users found. Run the main seed.ts first.');
    process.exit(1);
  }

  let created = 0;
  const baseDate = new Date('2026-02-10');

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const authorId = users[i % users.length].id;

    // Stagger creation dates
    const createdAt = new Date(baseDate.getTime() + i * 2 * 24 * 60 * 60 * 1000);

    // Check if skill already exists (by name)
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (existing) {
      console.log(`  Skipping "${skill.name}" (already exists)`);
      continue;
    }

    // Random install count between 500 and 8000
    const installCount = Math.floor(Math.random() * 7500) + 500;

    await prisma.skill.create({
      data: {
        name: skill.name,
        slug: generateSlug(skill.name),
        description: skill.description,
        content: skill.content,
        contentHash: hashContent(skill.content),
        domain: skill.domain,
        authorId,
        installCount,
        createdAt,
        tags: {
          create: skill.tags.map((tag) => ({ tag })),
        },
        testedOn: {
          create: skill.testedOn.map((model) => ({ model })),
        },
      },
    });

    created++;
    console.log(`  Created: "${skill.name}" (${skill.domain})`);
  }

  console.log(`\nDone! Created ${created} Reddit-sourced skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
