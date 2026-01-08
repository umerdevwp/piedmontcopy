import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Sandbox Mode Setting...');

    await prisma.globalSetting.upsert({
        where: { key: 'sandbox_mode' },
        update: { value: 'true' },
        create: {
            key: 'sandbox_mode',
            value: 'true',
            description: 'Enable to bypass real payments during development'
        }
    });

    console.log('   ✓ Set sandbox_mode = true');
    console.log('✅ Configuration Update Complete!');
}

main()
    .catch((e) => {
        console.error('❌ Config Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
