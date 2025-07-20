import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
    createMockUser: (overrides = {}) => ({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        toObject: () => ({
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: 'user',
            createdAt: new Date(),
        }),
        ...overrides,
    }),

    createMockJwtPayload: (overrides = {}) => ({
        email: 'test@example.com',
        sub: '507f1f77bcf86cd799439011',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        ...overrides,
    }),
}; 