/**
 * Seed script for SkillBrick AI platform skills.
 * These are official skills that help agents use the platform itself.
 *
 * Usage: npx tsx apps/api/src/prisma/seed-platform-skills.ts
 */
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

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
  console.log('Seeding platform skills...');

  const dataPath = path.join(__dirname, 'seed-platform-skills-data.json');
  const skills: SkillData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Use the first user as the platform author
  const users = await prisma.user.findMany({ select: { id: true, username: true } });
  if (users.length === 0) {
    console.error('No users found. Run the main seed.ts first.');
    process.exit(1);
  }

  const authorId = users[0].id;
  let created = 0;

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (existing) {
      console.log(`  Skipping "${skill.name}" (already exists)`);
      continue;
    }

    await prisma.skill.create({
      data: {
        name: skill.name,
        slug: skill.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        description: skill.description,
        content: skill.content,
        contentHash: require('crypto').createHash('sha256').update(skill.content).digest('hex'),
        domain: skill.domain,
        authorId,
        installCount: Math.floor(Math.random() * 25) + 5,
        createdAt: new Date('2026-03-01'),
        tags: {
          create: skill.tags.map((tag) => ({ tag })),
        },
        testedOn: {
          create: skill.testedOn.map((model) => ({ model })),
        },
        versions: {
          create: {
            version: 1,
            content: skill.content,
            contentHash: require('crypto').createHash('sha256').update(skill.content).digest('hex'),
          },
        },
      },
    });

    created++;
    console.log(`  Created: "${skill.name}" (${skill.domain})`);
  }

  console.log(`\nDone! Created ${created} platform skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
