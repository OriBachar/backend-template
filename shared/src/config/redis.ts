/**
 * Redis configuration for microservices
 * Provides Redis connection for message queues and caching
 */

import Redis from 'ioredis';
import { EnvironmentConfig } from '@/types/common';
import { ExternalServiceError } from '@/types/error';
import { RedisOptions } from '@/types/config';
import { logger } from '@/utils/logger';

/**
 * Creates Redis connection options
 */
const createRedisOptions = (config: EnvironmentConfig): RedisOptions => {
  const redisUrl = new URL(config.REDIS_URL || 'redis://localhost:6379');
  
  return {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port, 10),
    password: redisUrl.password || undefined,
    db: parseInt(redisUrl.pathname.slice(1), 10) || 0,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4, // IPv4
  };
};

/**
 * Creates Redis client instance
 * @param config Environment configuration
 * @returns Redis client instance
 */
export const createRedisClient = (config: EnvironmentConfig): Redis => {
  if (!config.REDIS_URL) {
    throw new ExternalServiceError('Redis URL is required for Redis connection');
  }

  const options = createRedisOptions(config);
  const redis = new Redis(options);

  // Setup event handlers
  redis.on('connect', () => {
    logger.info('Redis connected successfully', {
      host: options.host,
      port: options.port,
      db: options.db,
    });
  });

  redis.on('error', (error: Error) => {
    logger.error('Redis connection error', {
      host: options.host,
      port: options.port,
      error: error.message,
    }, error);
  });

  redis.on('close', () => {
    logger.warn('Redis connection closed');
  });

  redis.on('reconnecting', () => {
    logger.info('Redis reconnecting...');
  });

  redis.on('ready', () => {
    logger.info('Redis client ready');
  });

  return redis;
};

/**
 * Creates Redis client with connection retry logic
 * @param config Environment configuration
 * @param maxRetries Maximum number of retry attempts
 * @param retryDelay Delay between retries in milliseconds
 * @returns Promise that resolves with Redis client
 */
export const createRedisClientWithRetry = async (
  config: EnvironmentConfig,
  maxRetries = 5,
  retryDelay = 5000
): Promise<Redis> => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const redis = createRedisClient(config);
      
      // Test connection
      await redis.ping();
      
      logger.info('Redis connection established successfully');
      return redis;
    } catch (error) {
      retries++;
      logger.warn(`Redis connection attempt ${retries}/${maxRetries} failed`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        retryDelay,
      });

      if (retries >= maxRetries) {
        throw new ExternalServiceError(
          'Failed to connect to Redis after maximum retry attempts',
          { originalError: error instanceof Error ? error.message : 'Unknown error' }
        );
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new ExternalServiceError('Failed to create Redis client');
};

/**
 * Closes Redis connection
 * @param redis Redis client instance
 * @returns Promise that resolves when connection is closed
 */
export const closeRedisConnection = async (redis: Redis): Promise<void> => {
  try {
    await redis.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection', {
      error: error instanceof Error ? error.message : 'Unknown error',
    }, error as Error);

    throw new ExternalServiceError(
      'Failed to close Redis connection',
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
};

/**
 * Gets Redis connection status
 * @param redis Redis client instance
 * @returns Redis connection status
 */
export const getRedisStatus = (redis: Redis): boolean => {
  return redis.status === 'ready';
};

/**
 * Gets Redis connection statistics
 * @param redis Redis client instance
 * @returns Redis connection statistics
 */
export const getRedisStats = async (redis: Redis) => {
  try {
    const info = await redis.info();
    const memory = await redis.memory('STATS');
    
    return {
      status: redis.status,
      host: redis.options.host,
      port: redis.options.port,
      db: redis.options.db,
      memory: Array.isArray(memory) ? memory.length : 0,
      info: info.split('\r\n').reduce((acc: Record<string, string>, line: string) => {
        const [key, value] = line.split(':');
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {}),
    };
  } catch (error) {
    logger.error('Failed to get Redis statistics', {
      error: error instanceof Error ? error.message : 'Unknown error',
    }, error as Error);
    
    return {
      status: redis.status,
      host: redis.options.host,
      port: redis.options.port,
      db: redis.options.db,
      error: 'Failed to retrieve statistics',
    };
  }
};

/**
 * Creates a Redis client for message queues
 * @param config Environment configuration
 * @returns Redis client instance
 */
export const createMessageQueueRedis = (config: EnvironmentConfig): Redis => {
  const redis = createRedisClient(config);
  
  // Set specific options for message queues
  redis.options.maxRetriesPerRequest = 5;
  
  return redis;
};

/**
 * Creates a Redis client for caching
 * @param config Environment configuration
 * @returns Redis client instance
 */
export const createCacheRedis = (config: EnvironmentConfig): Redis => {
  const redis = createRedisClient(config);
  
  // Set specific options for caching
  redis.options.maxRetriesPerRequest = 1;
  
  return redis;
};

// Export default Redis client creation function
export default createRedisClient; 