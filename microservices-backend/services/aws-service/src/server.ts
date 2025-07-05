import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import awsRoutes from './routes/awsRoutes';

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    service: 'aws-service',
    message: 'AWS service is healthy',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    port: config.server.port
  });
});

// Routes
app.use('/api/v1', awsRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// Global error handlers
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err);
    if (config.server.env === 'production') {
        console.error('Critical error, shutting down...');
        process.exit(1);
    }
});

process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    if (config.server.env === 'production') {
        console.error('Critical error, shutting down...');
        process.exit(1);
    }
});

// Start server
const startServer = async () => {
    try {
        app.listen(config.server.port, () => {
            console.log(`☁️  AWS Service running on port ${config.server.port}`);
            console.log(`🌍 Environment: ${config.server.env}`);
            console.log('🚀 AWS Service is ready to handle S3, EC2, and deployment requests');
        });
    } catch (error) {
        console.error('Failed to start AWS Service:', error);
        if (!process.env.TEST_MODE) {
            process.exit(1);
        }
    }
};

startServer(); 