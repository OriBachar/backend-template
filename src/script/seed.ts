import { prisma } from '../config/database';
import { UserRole } from '../types/user';
import * as argon2 from 'argon2';

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        // Check if admin user already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });

        if (!existingAdmin) {
            const hashedPassword = await argon2.hash('admin123');
            
            await prisma.user.create({
                data: {
                    email: 'admin@example.com',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            
            console.log('✅ Admin user created successfully');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        // Check if regular user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'user@example.com' }
        });

        if (!existingUser) {
            const hashedPassword = await argon2.hash('user123');
            
            await prisma.user.create({
                data: {
                    email: 'user@example.com',
                    password: hashedPassword,
                    role: 'USER'
                }
            });
            
            console.log('✅ Regular user created successfully');
        } else {
            console.log('ℹ️ Regular user already exists');
        }

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed(); 