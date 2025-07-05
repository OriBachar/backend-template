// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Switch to the target database
db = db.getSiblingDB('backend-template');

// Create collections with basic structure
db.createCollection('users');
db.createCollection('tokens');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.tokens.createIndex({ token: 1 }, { unique: true });
db.tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Insert initial admin user (optional)
try {
  db.users.insertOne({
    email: 'admin@example.com',
    // This will be hashed by the application
    password: '$2b$10$example_hash_replace_in_production',
    role: 'admin',
    createdAt: new Date()
  });
  print('✅ Admin user created');
} catch (e) {
  print('⚠️  Admin user already exists or error:', e.message);
}

print('✅ MongoDB initialization completed');
print('📊 Collections created:');
print('  - users (with email index)');
print('  - tokens (with token and expiration indexes)');
print('🔐 Database: backend-template');
print('👤 Default admin: admin@example.com');
print('💡 Remember to change the default password in production!'); 