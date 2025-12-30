
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding users and linking orders...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const streets = ['Oak St', 'Maple Ave', 'Washington Blvd', 'Lakeview Dr', 'Park Ln'];
    const cities = ['Springfield', 'Riverside', 'Georgetown', 'Franklin', 'Clinton'];

    const usersData = [
        { email: 'user1@example.com', password: hashedPassword, role: 'customer', fullName: 'James Smith', phone: '555-0101', address: '123 Oak St, Springfield, IL' },
        { email: 'user2@example.com', password: hashedPassword, role: 'customer', fullName: 'Mary Johnson', phone: '555-0102', address: '456 Maple Ave, Riverside, CA' },
        { email: 'user3@example.com', password: hashedPassword, role: 'customer', fullName: 'Robert Williams', phone: '555-0103', address: '789 Washington Blvd, Georgetown, TX' },
        { email: 'user4@example.com', password: hashedPassword, role: 'customer', fullName: 'Patricia Brown', phone: '555-0104', address: '321 Lakeview Dr, Franklin, TN' },
        { email: 'user5@example.com', password: hashedPassword, role: 'customer', fullName: 'John Jones', phone: '555-0105', address: '654 Park Ln, Clinton, NY' },
    ];

    const users = [];
    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                fullName: u.fullName,
                phone: u.phone,
                address: u.address
            },
            create: u
        });
        users.push(user);
        console.log(`Created/Updated user: ${user.email}`);
    }

    // Link random orders to these users
    const orders = await prisma.order.findMany({ take: 10 });

    for (let i = 0; i < orders.length; i++) {
        const randomUser = users[i % users.length];
        await prisma.order.update({
            where: { id: orders[i].id },
            data: { userId: randomUser.id }
        });
        console.log(`Linked order #${orders[i].id} to user ${randomUser.email}`);
    }

    console.log('Seeding users finished.');
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
