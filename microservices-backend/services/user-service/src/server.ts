import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: config.cors.whitelist,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', userRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Check if TEST_MODE is enabled to skip database connection
        const testMode = process.env.TEST_MODE === 'true';
        
        if (!testMode) {
            await connectDB();
        } else {
            console.log('🧪 TEST MODE: Skipping database connection');
        }
        
        app.listen(config.server.port, () => {
            console.log(`👤 User Service running on port ${config.server.port}`);
            console.log(`🌍 Environment: ${config.server.env}`);
            if (testMode) {
                console.log('🧪 Running in TEST MODE (no database)');
            }
        });
    } catch (error) {
        console.error('Failed to start User Service:', error);
        if (!process.env.TEST_MODE) {
            process.exit(1);
        }
    }
};

startServer(); 