import dotenv from 'dotenv';
import path from 'path';
import { AppError } from '@microservices-backend/shared-types';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const getEnv = (key: string, required = false): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new AppError(`Environment variable ${key} is required`, 500);
    }
    return value || '';
}

export const getEnvNumber = (key: string, defaultValue?: number): number => {
    const value = getEnv(key);
    if (!value && defaultValue !== undefined) {
        return defaultValue;
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new AppError(`Environment variable ${key} must be a valid number`, 500);
    }
    return parsed;
}

export const getEnvArray = (key: string, separator = ',', defaultValue: string[] = []): string[] => {
    const value = getEnv(key);
    if (!value) {
        return defaultValue;
    }
    return value.split(separator).map(item => item.trim());
}

export const getEnvBoolean = (key: string, defaultValue = false): boolean => {
    const value = getEnv(key);
    if (!value) {
        return defaultValue;
    }
    return value.toLowerCase() === 'true';
}

// Common configuration factory
export const createServiceConfig = (serviceName: string, defaultPort: number) => {
    const envPrefix = serviceName.toUpperCase().replace('-', '_');
    
    // Get MongoDB URI - required
    const mongoUri = getEnv('MONGODB_URI', true);
    
    // Extract database name from URI if not provided separately
    let dbName = getEnv('DB_NAME', false);
    if (!dbName) {
        // Try to extract database name from URI
        const uriMatch = mongoUri.match(/\/([^/?]+)(\?|$)/);
        dbName = uriMatch ? uriMatch[1] : 'backend-template';
    }
    
    return {
        server: {
            port: getEnvNumber(`${envPrefix}_PORT`, defaultPort),
            env: getEnv('NODE_ENV', false) || 'development',
        },
        cors: {
            whitelist: getEnvArray('CORS_WHITELIST', ',', ['http://localhost:3000'])
        },
        mongodb: {
            uri: mongoUri,
            dbName: dbName
        },
        jwt: {
            secret: getEnv('JWT_SECRET', true),
            accessTokenExpiry: getEnv('JWT_ACCESS_TOKEN_EXPIRY', false) || '15m',
            refreshTokenExpiry: getEnv('JWT_REFRESH_TOKEN_EXPIRY', false) || '7d'
        }
    };
}; 