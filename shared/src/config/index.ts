/**
 * Main config export file for the shared library
 * Provides clean imports using path mapping
 */

// Environment configuration exports
export * from '@/config/env';

// Database configuration exports
export * from '@/config/database';

// Redis configuration exports
export * from '@/config/redis';

// Re-export commonly used config functions for convenience
export {
  config,
  createEnvironmentConfig,
  getConfig,
  getNodeEnv,
  getPort,
  getDatabaseUrl,
  getRedisUrl,
  getRabbitMQUrl,
  getJwtSecret,
  getJwtExpiresIn,
  getCorsOrigin,
  getRateLimitWindowMs,
  getRateLimitMax
} from '@/config/env';

export {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
  getDatabaseStats,
  connectDatabaseWithRetry
} from '@/config/database';

export {
  createRedisClient,
  createRedisClientWithRetry,
  closeRedisConnection,
  getRedisStatus,
  getRedisStats,
  createMessageQueueRedis,
  createCacheRedis
} from '@/config/redis'; 