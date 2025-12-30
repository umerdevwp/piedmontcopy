
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Order Regeneration Started ---');

    // 1. Clear existing orders and items
    console.log('Cleaning up existing orders...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    // 2. Fetch Users and Products
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany({
        include: {
            options: {
                include: {
                    values: true
                }
            }
        }
    });

    if (users.length === 0 || products.length === 0) {
        console.error('Error: Please seed users and products before seeding orders.');
        return;
    }

    const orderStatuses = ['received', 'processing', 'printing', 'shipped', 'delivered'];

    console.log(`Generating 15 new orders for ${users.length} users and ${products.length} products...`);

    for (let i = 1; i <= 15; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

        // Random number of items per order (1 to 3)
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const itemsToCreate = [];
        let totalOrderAmount = 0;

        for (let j = 0; j < itemCount; j++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];

            // Generate configuration based on product options
            const config: Record<string, string> = {};
            randomProduct.options.forEach(opt => {
                if (opt.values.length > 0) {
                    const randomVal = opt.values[Math.floor(Math.random() * opt.values.length)];
                    config[opt.name] = randomVal.name;
                }
            });

            const quantity = Math.floor(Math.random() * 5) + 1;
            const subtotal = Number(randomProduct.basePrice) * quantity;
            totalOrderAmount += subtotal;

            itemsToCreate.push({
                productId: randomProduct.id,
                quantity: quantity,
                configurations: config,
                subtotal: subtotal,
                fileUrl: 'https://example.com/demo-artwork.pdf'
            });
        }

        // Create the order using user's profile for shipping if possible
        const order = await prisma.order.create({
            data: {
                userId: randomUser.id,
                status: randomStatus,
                totalAmount: totalOrderAmount,
                shippingAddress: {
                    name: randomUser.fullName || 'Valued Customer',
                    email: randomUser.email,
                    phone: randomUser.phone || '555-0000',
                    address: randomUser.address || 'Default Warehouse St, City, Zip',
                    city: 'Springfield', // Generic additions
                    state: 'IL',
                    zip: '62704'
                },
                items: {
                    create: itemsToCreate
                }
            }
        });

        console.log(`[Order #${i}] ID: ${order.id} | User: ${randomUser.email} | Items: ${itemCount} | Total: $${totalOrderAmount.toFixed(2)}`);
    }

    console.log('--- Order Regeneration Finished ---');
}

main()
    .catch((e) => {
        console.error(e);
        // @ts-ignore
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
