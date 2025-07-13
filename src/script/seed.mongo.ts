import mongoose from 'mongoose';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { UserRole } from '../types/user';
import argon2 from 'argon2';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'backend-template';

const roles = [
  { name: 'admin', description: 'Administrator role' },
  { name: 'user', description: 'Regular user role' },
  { name: 'moderator', description: 'Moderator role' },
];

const permissions = [
  { name: 'user:read', description: 'Read user data', resource: 'user', action: 'read' },
  { name: 'user:write', description: 'Write user data', resource: 'user', action: 'write' },
  { name: 'admin:full', description: 'Full admin access', resource: 'admin', action: 'full' },
  { name: 'profile:read', description: 'Read profile', resource: 'profile', action: 'read' },
  { name: 'profile:write', description: 'Write profile', resource: 'profile', action: 'write' },
];

const users = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    isActive: true,
  },
  {
    email: 'user@example.com',
    password: 'user123',
    role: UserRole.USER,
    isActive: true,
  },
];

const profiles = [
  {
    userEmail: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    bio: 'I am the admin.',
  },
  {
    userEmail: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    bio: 'I am a regular user.',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log('🌱 Connected to MongoDB');

    // Seed roles
    await Role.deleteMany({});
    await Role.insertMany(roles);
    console.log('✅ Roles created successfully');

    // Seed permissions
    await Permission.deleteMany({});
    await Permission.insertMany(permissions);
    console.log('✅ Permissions created successfully');

    // Seed users
    await User.deleteMany({});
    for (const user of users) {
      const hashedPassword = await argon2.hash(user.password);
      await User.create({
        email: user.email,
        password: hashedPassword,
        role: user.role,
        isActive: user.isActive,
      });
    }
    console.log('✅ Users created successfully');

    // Seed profiles
    await Profile.deleteMany({});
    for (const profile of profiles) {
      const user = await User.findOne({ email: profile.userEmail });
      if (user) {
        await Profile.create({
          userId: user._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          bio: profile.bio,
        });
      }
    }
    console.log('✅ User profiles created successfully');

    console.log('🎉 MongoDB seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during MongoDB seeding:', error);
    process.exit(1);
  }
}

seed(); 