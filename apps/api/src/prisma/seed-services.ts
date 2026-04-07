/**
 * Seed script for SkillBrick AI paid services.
 *
 * Usage: npx tsx apps/api/src/prisma/seed-services.ts
 */
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

interface ServiceData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  pricingType: string;
  category: string;
  features: string[];
}

async function main() {
  console.log('Seeding paid services...');

  const dataPath = path.join(__dirname, 'seed-services-data.json');
  const services: ServiceData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  let created = 0;

  for (const service of services) {
    const existing = await prisma.service.findUnique({
      where: { slug: service.slug },
    });

    if (existing) {
      console.log(`  Skipping "${service.name}" (already exists)`);
      continue;
    }

    await prisma.service.create({
      data: {
        name: service.name,
        slug: service.slug,
        description: service.description,
        longDescription: service.longDescription,
        price: service.price,
        currency: service.currency,
        pricingType: service.pricingType as any,
        category: service.category,
        features: service.features,
      },
    });

    created++;
    console.log(`  Created: "${service.name}" ($${(service.price / 100).toFixed(2)})`);
  }

  console.log(`\nDone! Created ${created} paid services.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
