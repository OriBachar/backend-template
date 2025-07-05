import mongoose from 'mongoose';
import { AppError } from '@microservices-backend/shared-types';

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

export interface DatabaseConfig {
    uri: string;
    dbName: string;
}

export const connectDB = async (config: DatabaseConfig, serviceName: string, attempt = 1): Promise<void> => {
    try {
        // If URI already contains database and auth parameters, use it as-is
        // Otherwise, construct the proper URI
        let uri = config.uri;
        
        // Check if URI already contains database name and auth parameters
        if (!uri.includes('?') && !uri.includes(config.dbName)) {
            // Simple URI without database, append database name
            uri = uri.endsWith('/') ? `${uri}${config.dbName}` : `${uri}/${config.dbName}`;
        }
        
        console.log(`🔗 ${serviceName}: Attempting MongoDB connection...`);
        await mongoose.connect(uri);
        console.log(`🔗 ${serviceName}: MongoDB connected successfully`);
    } catch (error) {
        console.error(`🔗 ${serviceName}: MongoDB connection error attempt ${attempt}/${MAX_RETRIES}:`, error);
        
        if(attempt < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
            setTimeout(() => connectDB(config, serviceName, attempt + 1), RETRY_INTERVAL);
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

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('🔗 MongoDB disconnected successfully');
    } catch (error) {
        console.error('🔗 MongoDB disconnection error:', error);
        throw error;
    }
}; 