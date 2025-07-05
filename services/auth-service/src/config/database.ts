import { connectDB as connectDatabase } from '@microservices-backend/shared-utils';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
    await connectDatabase(config.mongodb, 'Auth Service');
}; 