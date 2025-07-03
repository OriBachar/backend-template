/**
 * Database configuration for microservices
 * Provides MongoDB connection with connection pooling and error handling
 */

import mongoose from 'mongoose';
import { EnvironmentConfig } from '@/types/common';
import { DatabaseError } from '@/types/error';
import { DatabaseOptions } from '@/types/config';
import { logger } from '@/utils/logger';

/**
 * Creates database connection options
 */
const createDatabaseOptions = (): mongoose.ConnectOptions => {
  const options: mongoose.ConnectOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    autoIndex: true,
    autoCreate: true,
  };

  return options;
};

/**
 * Handles database connection events
 */
const setupConnectionHandlers = (): void => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (error: unknown) => {
    logger.error('MongoDB connection error', { error: error instanceof Error ? error.message : 'Unknown error' }, error as Error);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      logger.error('Error closing MongoDB connection', { error: error instanceof Error ? error.message : 'Unknown error' }, error as Error);
      process.exit(1);
    }
  });
};

/**
 * Connects to MongoDB database
 * @param config Environment configuration
 * @returns Promise that resolves when connection is established
 */
export const connectDatabase = async (config: EnvironmentConfig): Promise<void> => {
  try {
    // Setup connection event handlers
    setupConnectionHandlers();

    // Create connection options
    const options = createDatabaseOptions();

    // Connect to database
    await mongoose.connect(config.DATABASE_URL, options);

    logger.info('Database connection established', {
      url: config.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Hide credentials
      maxPoolSize: options.maxPoolSize,
    });
  } catch (error) {
    logger.error('Failed to connect to database', {
      url: config.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, error as Error);

    throw new DatabaseError(
      'Failed to connect to database',
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
};

/**
 * Disconnects from MongoDB database
 * @returns Promise that resolves when connection is closed
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', {
      error: error instanceof Error ? error.message : 'Unknown error',
    }, error as Error);

    throw new DatabaseError(
      'Failed to close database connection',
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
};

/**
 * Gets database connection status
 * @returns Database connection status
 */
export const getDatabaseStatus = (): boolean => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

/**
 * Gets database connection statistics
 * @returns Database connection statistics
 */
export const getDatabaseStats = () => {
  return {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    models: Object.keys(mongoose.connection.models),
  };
};

/**
 * Creates a database connection with retry logic
 * @param config Environment configuration
 * @param maxRetries Maximum number of retry attempts
 * @param retryDelay Delay between retries in milliseconds
 * @returns Promise that resolves when connection is established
 */
export const connectDatabaseWithRetry = async (
  config: EnvironmentConfig,
  maxRetries = 5,
  retryDelay = 5000
): Promise<void> => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await connectDatabase(config);
      return;
    } catch (error) {
      retries++;
      logger.warn(`Database connection attempt ${retries}/${maxRetries} failed`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        retryDelay,
      });

      if (retries >= maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// Export default connection function
export default connectDatabase; 