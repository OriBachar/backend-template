import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.whitelist,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    service: 'auth-service',
    message: 'Auth service is healthy',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    port: config.server.port
  });
});

// Routes
app.use('/', authRoutes);

// Error handling
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

const PORT = config.server.port || 3001;

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
    
    app.listen(PORT, () => {
      console.log(`🔐 Auth Service running on port ${PORT}`);
      console.log(`🌍 Environment: ${config.server.env}`);
      if (testMode) {
        console.log('🧪 Running in TEST MODE (no database)');
      }
    });
  } catch (error) {
    console.error('Failed to start Auth Service:', error);
    if (!process.env.TEST_MODE) {
      process.exit(1);
    }
  }
};

startServer(); 