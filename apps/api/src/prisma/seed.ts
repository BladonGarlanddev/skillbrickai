import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import { createHash } from 'crypto';

function generateSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

function skillMeta(name: string, content: string) {
  return { slug: generateSlug(name), contentHash: hashContent(content) };
}

const prisma = new PrismaClient();

interface SkillData {
  name: string;
  description: string;
  content: string;
  domain: string;
  githubUsername: string;
  authorName: string | null;
  sourceUrl: string;
  tags: string[];
  testedOn: string[];
}

/**
 * Generate a DiceBear avatar URL for a given username.
 * Uses the "thumbs" style for friendly, abstract avatars.
 */
function avatarUrl(username: string): string {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(username)}`;
}

async function main() {
  console.log('Wiping database...');

  // Delete all data in dependency order
  await prisma.showcaseSkill.deleteMany();
  await prisma.showcase.deleteMany();
  await prisma.skillRequestReply.deleteMany();
  await prisma.skillRequest.deleteMany();
  await prisma.post.deleteMany();
  await prisma.collectionSkill.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.improvementSuggestion.deleteMany();
  await prisma.upvote.deleteMany();
  await prisma.tokenTransaction.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.skillTestedOn.deleteMany();
  await prisma.skillTag.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database wiped.\n');

  // Load skill data
  const dataPath = path.join(__dirname, 'seed-skills-data.json');
  const skills: SkillData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Collect unique GitHub authors
  const authorMap = new Map<string, { name: string | null; sourceUrl: string }>();
  for (const skill of skills) {
    if (!authorMap.has(skill.githubUsername)) {
      authorMap.set(skill.githubUsername, {
        name: skill.authorName,
        sourceUrl: skill.sourceUrl,
      });
    }
  }

  // Create a User record for each GitHub author
  console.log('Creating users from GitHub authors...');
  const userIds = new Map<string, string>();

  for (const [username, info] of authorMap) {
    const user = await prisma.user.create({
      data: {
        email: `${username}@github-sourced.local`,
        username,
        avatarUrl: avatarUrl(username),
        bio: info.name
          ? `${info.name} — skills sourced from GitHub`
          : `Skills sourced from GitHub`,
        communityScore: 0,
        tokenBalance: 0,
        isEarlyAdopter: false,
      },
    });
    userIds.set(username, user.id);
    console.log(`  Created user: ${username}${info.name ? ` (${info.name})` : ''}`);
  }

  // Create skills
  console.log('\nCreating skills...');
  const baseDate = new Date('2026-01-10');
  let created = 0;

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const authorId = userIds.get(skill.githubUsername)!;

    // Stagger creation dates (every 1-3 days)
    const dayOffset = i * 2 + Math.floor(Math.random() * 2);
    const createdAt = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

    // Random install count between 0 and 30
    const installCount = Math.floor(Math.random() * 31);

    const { slug, contentHash } = skillMeta(skill.name, skill.content);

    await prisma.skill.create({
      data: {
        name: skill.name,
        slug,
        description: skill.description,
        content: skill.content,
        contentHash,
        domain: skill.domain,
        authorId,
        installCount,
        createdAt,
        originalAuthorName: skill.authorName ?? skill.githubUsername,
        originalAuthorUrl: `https://github.com/${skill.githubUsername}`,
        sourceUrl: skill.sourceUrl,
        tags: {
          create: skill.tags.map((tag) => ({ tag })),
        },
        testedOn: {
          create: skill.testedOn.map((model) => ({ model })),
        },
      },
    });

    created++;
    console.log(`  Created: "${skill.name}" by ${skill.githubUsername} (${installCount} installs)`);
  }

  console.log(`\nSeed complete!`);
  console.log(`Created ${userIds.size} users and ${created} skills.`);
  console.log(`All skills sourced from real GitHub repositories with proper attribution.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
