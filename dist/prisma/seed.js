"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
dotenv.config();
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding data with new unified schema...');
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
                        event: client_1.RuleEvent.GIFT,
                        condition: { giftId: 5655, giftName: 'Rose' },
                        action: client_1.RuleAction.RCON_COMMAND,
                        key: '/give @p apple 1'
                    },
                    {
                        event: client_1.RuleEvent.LIKE,
                        condition: { count: 100 },
                        action: client_1.RuleAction.KEY_PRESS,
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
                        event: client_1.RuleEvent.GIFT,
                        condition: { giftId: 54724, giftName: 'Creeper' },
                        action: client_1.RuleAction.RCON_COMMAND,
                        key: '/summon creeper ~ ~1 ~'
                    },
                    {
                        event: client_1.RuleEvent.GIFT,
                        condition: { giftId: 5827, giftName: 'Ice Cream Cone' },
                        action: client_1.RuleAction.RCON_COMMAND,
                        key: '/summon stray ~ ~1 ~'
                    },
                    {
                        event: client_1.RuleEvent.COMMENT,
                        condition: { keyword: 'jump' },
                        action: client_1.RuleAction.KEY_PRESS,
                        key: 'Space'
                    },
                ],
            },
        },
    });
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
    const tiktokGiftsPath = path.join(__dirname, '../../tiktok_gifts.json');
    const legacyGiftsPath = path.join(__dirname, '../../gifts.json');
    let giftsData = [];
    let isNewFormat = false;
    if (fs.existsSync(tiktokGiftsPath)) {
        console.log('Found tiktok_gifts.json, seeding gifts...');
        giftsData = JSON.parse(fs.readFileSync(tiktokGiftsPath, 'utf8'));
        isNewFormat = true;
    }
    else if (fs.existsSync(legacyGiftsPath)) {
        console.log('Found gifts.json, seeding gifts...');
        giftsData = JSON.parse(fs.readFileSync(legacyGiftsPath, 'utf8'));
        isNewFormat = false;
    }
    if (giftsData.length > 0) {
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
                where: { name },
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
//# sourceMappingURL=seed.js.map