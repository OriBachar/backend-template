import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import { config } from './env';
import { AppError } from '../types/error';

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

// MongoDB Connection
export const connectMongoDB = async (attempt = 1): Promise<void> => {
    try {
        if (!config.database.mongodb.uri) {
            throw new AppError('MongoDB URI is required when using MongoDB', 500);
        }

        const uri = config.database.mongodb.uri.endsWith(config.database.mongodb.dbName || '') 
            ? config.database.mongodb.uri 
            : `${config.database.mongodb.uri}/${config.database.mongodb.dbName || 'backend-template'}`;
            
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`MongoDB connection error attempt ${attempt}/${MAX_RETRIES}:`, error);
        
        if(attempt < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
            setTimeout(() => connectMongoDB(attempt + 1), RETRY_INTERVAL);
        } else {
            console.error('Max retries reached. Exiting...');
            const dbError = new AppError(
                'Failed to connect to MongoDB after maximum retry attempts',
                500
            );
            dbError.stack = error instanceof Error ? error.stack : undefined;
            throw dbError;
        }
    }
};

// PostgreSQL Connection with Prisma
export const prisma = new PrismaClient();

export const connectPostgreSQL = async (): Promise<void> => {
    try {
        if (!config.database.postgresql.url) {
            throw new AppError('DATABASE_URL is required when using PostgreSQL', 500);
        }

        await prisma.$connect();
        console.log('PostgreSQL connected successfully via Prisma');
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        const dbError = new AppError(
            'Failed to connect to PostgreSQL',
            500
        );
        dbError.stack = error instanceof Error ? error.stack : undefined;
        throw dbError;
    }
};

// Database Factory
export const connectDB = async (): Promise<void> => {
    const dbType = config.database.type.toLowerCase();
    
    switch (dbType) {
        case 'mongodb':
            await connectMongoDB();
            break;
        case 'postgresql':
            await connectPostgreSQL();
            break;
        default:
            throw new AppError(`Unsupported database type: ${dbType}. Use 'mongodb' or 'postgresql'`, 500);
    }
};

// Graceful shutdown
export const disconnectDB = async (): Promise<void> => {
    const dbType = config.database.type.toLowerCase();
    
    if (dbType === 'mongodb') {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } else if (dbType === 'postgresql') {
        await prisma.$disconnect();
        console.log('PostgreSQL disconnected');
    }
};