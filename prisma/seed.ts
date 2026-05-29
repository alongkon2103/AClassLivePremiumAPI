import { PrismaClient, UserRole, UserStatus, RuleEvent, RuleAction } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding data with new unified schema...');

  // 1. Create Admin User
  const admin = await prisma.users.upsert({
    where: { email: 'admin@aclass.store' },
    update: {},
    create: {
      email: 'admin@aclass.store',
      username: 'A Class Admin',
      role: 'admin',
      nativeStatus: 'ACTIVE',
    },
  });
  console.log('Created Admin:', admin.email);

  // 2. Create Games
  const mc = await prisma.games.upsert({
    where: { name: 'Minecraft' },
    update: {},
    create: {
      name: 'Minecraft',
      description: 'The ultimate sandbox building game.',
      createdById: admin.id,
    },
  });

  const generalGame = await prisma.games.upsert({
    where: { name: 'General' },
    update: {},
    create: {
      name: 'General',
      description: 'Default category for custom presets.',
      createdById: admin.id,
    },
  });

  // 3. Create Presets for Minecraft
  await prisma.presets.upsert({
    where: {
      createdById_gameId_name: {
        createdById: admin.id,
        gameId: mc.id,
        name: 'Standard Survival',
      },
    },
    update: {},
    create: {
      name: 'Standard Survival',
      description: 'Basic mappings for survival mode',
      isDefault: true,
      gameId: mc.id,
      createdById: admin.id,
      rules: {
        create: [
          { 
            event: RuleEvent.GIFT, 
            condition: { giftId: 5655, giftName: 'Rose' }, 
            action: RuleAction.RCON_COMMAND, 
            key: '/give @p apple 1' 
          },
          { 
            event: RuleEvent.LIKE, 
            condition: { count: 100 }, 
            action: RuleAction.KEY_PRESS, 
            key: 'Space' 
          },
        ],
      },
    },
  });

  await prisma.presets.upsert({
    where: {
      createdById_gameId_name: {
        createdById: admin.id,
        gameId: mc.id,
        name: 'Hardcore Challenges',
      },
    },
    update: {},
    create: {
      name: 'Hardcore Challenges',
      description: 'Spawn monsters and trigger dangerous events for gifts.',
      isDefault: true,
      gameId: mc.id,
      createdById: admin.id,
      rules: {
        create: [
          { 
            event: RuleEvent.GIFT, 
            condition: { giftId: 54724, giftName: 'Creeper' }, 
            action: RuleAction.RCON_COMMAND, 
            key: '/summon creeper ~ ~1 ~' 
          },
          { 
            event: RuleEvent.GIFT, 
            condition: { giftId: 5827, giftName: 'Ice Cream Cone' }, 
            action: RuleAction.RCON_COMMAND, 
            key: '/summon stray ~ ~1 ~' 
          },
          { 
            event: RuleEvent.COMMENT, 
            condition: { keyword: 'jump' }, 
            action: RuleAction.KEY_PRESS, 
            key: 'Space' 
          },
        ],
      },
    },
  });

  // 4. Create Announcements
  const existingAnn = await prisma.announcements.findFirst({
    where: { title: 'Welcome to A Class Store Pro!' }
  });
  
  if (!existingAnn) {
    await prisma.announcements.create({
      data: {
        title: 'Welcome to A Class Store Pro!',
        content: 'Experience the new standard in TikTok Live Automation.',
        isActive: true,
        createdById: admin.id,
      },
    });
  }

  // 5. Seed Gifts from tiktok_gifts.json or gifts.json
  const tiktokGiftsPath = path.join(__dirname, '../../tiktok_gifts.json');
  const legacyGiftsPath = path.join(__dirname, '../../gifts.json');
  
  let giftsData: any[] = [];
  let isNewFormat = false;

  if (fs.existsSync(tiktokGiftsPath)) {
    console.log('Found tiktok_gifts.json, seeding gifts...');
    giftsData = JSON.parse(fs.readFileSync(tiktokGiftsPath, 'utf8'));
    isNewFormat = true;
  } else if (fs.existsSync(legacyGiftsPath)) {
    console.log('Found gifts.json, seeding gifts...');
    giftsData = JSON.parse(fs.readFileSync(legacyGiftsPath, 'utf8'));
    isNewFormat = false;
  }

  if (giftsData.length > 0) {
    // Add special "None" gift
    await prisma.gifts.upsert({
      where: { id: 10001 },
      update: {},
      create: {
        id: 10001,
        name: 'None',
        image_url: null,
        diamonds: 0,
        trigger_type: 'none',
        is_active: true,
      },
    });

    for (const gift of giftsData) {
      const giftId = gift.id;
      const name = gift.name;
      const imageUrl = isNewFormat ? gift.image : gift.image_url;
      const diamonds = isNewFormat ? (gift.coins || 1) : (gift.diamonds || 1);
      const isActive = isNewFormat ? true : (gift.is_active ?? true);
      const sortOrder = isNewFormat ? 0 : (gift.sort_order ?? 0);
      const triggerType = isNewFormat ? 'gift' : (gift.trigger_type ?? 'gift');

      await prisma.gifts.upsert({
        where: { name }, // Name is unique in the store schema
        update: {
          image_url: imageUrl,
          diamonds,
          is_active: isActive,
          sort_order: sortOrder,
          trigger_type: triggerType,
        },
        create: {
          name,
          image_url: imageUrl,
          diamonds,
          is_active: isActive,
          sort_order: sortOrder,
          trigger_type: triggerType,
        },
      });
    }
    console.log(`Seeded ${giftsData.length} gifts.`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
