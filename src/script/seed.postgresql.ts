import { prisma } from '../config/database';
import { UserRole } from '../types/user';
import * as argon2 from 'argon2';

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        // Create default roles
        const adminRole = await prisma.role.upsert({
            where: { name: 'admin' },
            update: {},
            create: {
                name: 'admin',
                description: 'Administrator with full access'
            }
        });

        const userRole = await prisma.role.upsert({
            where: { name: 'user' },
            update: {},
            create: {
                name: 'user',
                description: 'Standard user'
            }
        });

        const moderatorRole = await prisma.role.upsert({
            where: { name: 'moderator' },
            update: {},
            create: {
                name: 'moderator',
                description: 'Moderator with limited admin access'
            }
        });

        console.log('✅ Roles created successfully');

        // Create default permissions
        const permissions = [
            { name: 'user:read', description: 'Read user data', resource: 'user', action: 'read' },
            { name: 'user:write', description: 'Write user data', resource: 'user', action: 'write' },
            { name: 'admin:full', description: 'Full admin access', resource: 'admin', action: 'full' },
            { name: 'profile:read', description: 'Read profile data', resource: 'profile', action: 'read' },
            { name: 'profile:write', description: 'Write profile data', resource: 'profile', action: 'write' }
        ];

        for (const perm of permissions) {
            await prisma.permission.upsert({
                where: { name: perm.name },
                update: {},
                create: perm
            });
        }

        console.log('✅ Permissions created successfully');

        // Check if admin user already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });

        if (!existingAdmin) {
            const hashedPassword = await argon2.hash('admin123');
            
            const adminUser = await prisma.user.create({
                data: {
                    email: 'admin@example.com',
                    password: hashedPassword,
                    role: 'ADMIN',
                    isActive: true
                }
            });

            // Assign admin role to admin user
            await prisma.userRole.create({
                data: {
                    userId: adminUser.id,
                    roleId: adminRole.id
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
            
            const regularUser = await prisma.user.create({
                data: {
                    email: 'user@example.com',
                    password: hashedPassword,
                    role: 'USER',
                    isActive: true
                }
            });

            // Assign user role to regular user
            await prisma.userRole.create({
                data: {
                    userId: regularUser.id,
                    roleId: userRole.id
                }
            });
            
            console.log('✅ Regular user created successfully');
        } else {
            console.log('ℹ️ Regular user already exists');
        }

        // Create sample profiles
        const adminUser = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });

        if (adminUser) {
            await prisma.profile.upsert({
                where: { userId: adminUser.id },
                update: {},
                create: {
                    userId: adminUser.id,
                    firstName: 'Admin',
                    lastName: 'User',
                    bio: 'System Administrator',
                    preferences: {
                        theme: 'dark',
                        notifications: true,
                        language: 'en'
                    }
                }
            });
        }

        const regularUser = await prisma.user.findUnique({
            where: { email: 'user@example.com' }
        });

        if (regularUser) {
            await prisma.profile.upsert({
                where: { userId: regularUser.id },
                update: {},
                create: {
                    userId: regularUser.id,
                    firstName: 'Regular',
                    lastName: 'User',
                    bio: 'Standard user account',
                    preferences: {
                        theme: 'light',
                        notifications: false,
                        language: 'en'
                    }
                }
            });
        }

        console.log('✅ User profiles created successfully');

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Sample Data:');
        console.log('- Admin: admin@example.com / admin123');
        console.log('- User: user@example.com / user123');
        console.log('- Roles: admin, user, moderator');
        console.log('- Permissions: user:read, user:write, admin:full, profile:read, profile:write');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed(); 