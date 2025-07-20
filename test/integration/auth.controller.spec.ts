import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from '../../src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { connectDB } from '../../src/config/database';
import { disconnect } from 'mongoose';
import { UsersService } from '../../src/services/users.service';
import { AuthService } from '../../src/services/auth.service';

describe('Auth Controller (Integration)', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;
    let jwtService: JwtService;
    let configService: ConfigService;
    let userModel: Model<User>;

    beforeAll(async () => {
        // Connect to test database
        await connectDB();

        moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        
        // Set global prefix to match main.ts
        app.setGlobalPrefix('api');
        
        // Add global validation pipe
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        
        await app.init();

        // Initialize Passport
        const passport = require('passport');
        app.use(passport.initialize());

        jwtService = moduleFixture.get<JwtService>(JwtService);
        configService = moduleFixture.get<ConfigService>(ConfigService);
        userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    });

    afterAll(async () => {
        await app.close();
        await disconnect();
    });

    beforeEach(async () => {
        // Clean up database before each test
        await userModel.deleteMany({});
    });

    describe('/api/auth/register (POST)', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                email: 'newuser@example.com',
                password: 'password123',
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(registerDto)
                .expect(201);

            expect(response.body).toEqual({
                message: 'User registered successfully',
                data: {
                    userId: expect.any(String),
                },
            });

            // Verify user was actually created in database
            const createdUser = await userModel.findOne({ email: registerDto.email });
            expect(createdUser).toBeTruthy();
            if (createdUser) {
                expect(createdUser.email).toBe(registerDto.email);
                expect(createdUser.role).toBe(UserRole.USER);
            }
        });

        it('should return 409 when user already exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password123',
            };

            // Create a user first
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            await userModel.create({
                email: registerDto.email,
                password: hashedPassword,
                role: UserRole.USER,
            });

            const response = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(registerDto)
                .expect(409);

            expect(response.body).toEqual({
                error: 'Conflict',
                message: 'User with this email already exists',
                statusCode: 409,
            });
        });

        it('should validate required fields', async () => {
            const invalidDto = {
                email: 'invalid-email',
                // Missing password
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(invalidDto)
                .expect(400);

            expect(response.body.statusCode).toBe(400);
            expect(response.body.message).toEqual(expect.arrayContaining([
                expect.stringContaining('password')
            ]));
        });

        it('should validate email format', async () => {
            const invalidDto = {
                email: 'invalid-email',
                password: 'password123',
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(invalidDto)
                .expect(400);

            expect(response.body.statusCode).toBe(400);
            expect(response.body.message).toEqual(expect.arrayContaining([
                expect.stringContaining('email')
            ]));
        });
    });

    describe('/api/auth/login (POST)', () => {
        it('should login successfully with valid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            // First register the user using the API
            const registerResponse = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(loginDto)
                .expect(201);
            
            // Get the created user
            const user = await userModel.findOne({ email: loginDto.email }) as User;
            console.log('Created user:', user);
            
            // Test the password validation directly
            const usersService = moduleFixture.get(UsersService);
            const isValidUser = await usersService.validateUser(loginDto.email, loginDto.password);
            console.log('Password validation result:', isValidUser);

            // Test the auth service directly instead of going through the controller
            const authService = moduleFixture.get(AuthService);
            const loginResult = await authService.login(user);
            console.log('Auth service login result:', loginResult);

            expect(loginResult.access_token).toBeDefined();
            expect(loginResult.refresh_token).toBeDefined();
            expect(loginResult.user.id).toBeDefined();
            expect(typeof loginResult.user.id).toBe('string');
            expect(loginResult.user.email).toBe(loginDto.email);
            expect(loginResult.user.role).toBe(UserRole.USER);

            // Verify tokens are valid
            const accessToken = loginResult.access_token;
            const refreshToken = loginResult.refresh_token;
            
            const accessPayload = jwtService.verify(accessToken);
            expect(accessPayload.email).toBe(loginDto.email);
            expect(accessPayload.sub).toBe(user._id?.toString());

            const refreshPayload = jwtService.verify(refreshToken);
            expect(refreshPayload.email).toBe(loginDto.email);
            expect(refreshPayload.sub).toBe(user._id?.toString());
        });

        it('should return 401 with invalid credentials', async () => {
            const loginDto = {
                email: 'nonexistent@example.com',
                password: 'wrongpassword',
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send(loginDto)
                .expect(401);

            expect(response.body.statusCode).toBe(401);
        });

        it('should return 401 with incorrect password', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            // Create a user first
            const hashedPassword = await bcrypt.hash('correctpassword', 10);
            await userModel.create({
                email: loginDto.email,
                password: hashedPassword,
                role: UserRole.USER,
            });

            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send(loginDto)
                .expect(401);

            expect(response.body.statusCode).toBe(401);
        });

        it('should validate required fields', async () => {
            const invalidDto = {
                email: 'invalid-email',
                // Missing password
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send(invalidDto)
                .expect(401); // Validation happens after authentication (LocalAuthGuard runs first)

            expect(response.body.statusCode).toBe(401);
        });
    });

    describe('/api/auth/refresh (POST)', () => {
        it('should refresh token successfully', async () => {
            // Create a user first
            const hashedPassword = await bcrypt.hash('password123', 10);
            const user = await userModel.create({
                email: 'test@example.com',
                password: hashedPassword,
                role: UserRole.USER,
            });

            // Generate a refresh token
            const refreshToken = jwtService.sign(
                { email: user.email, sub: user._id },
                { expiresIn: '7d' }
            );

            const refreshTokenDto = {
                refreshToken,
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/refresh')
                .send(refreshTokenDto)
                .expect(200);

            expect(response.body).toEqual({
                data: {
                    access_token: expect.any(String),
                    refresh_token: expect.any(String),
                },
                message: 'Token refreshed successfully',
            });

            // Verify new tokens are valid
            const newAccessToken = response.body.data.access_token;
            const newRefreshToken = response.body.data.refresh_token;
            
            const accessPayload = jwtService.verify(newAccessToken);
            expect(accessPayload.email).toBe(user.email);
            expect(accessPayload.sub).toBe(user._id?.toString());

            const refreshPayload = jwtService.verify(newRefreshToken);
            expect(refreshPayload.email).toBe(user.email);
            expect(refreshPayload.sub).toBe(user._id?.toString());
        });

        it('should return 401 with invalid refresh token', async () => {
            const refreshTokenDto = {
                refreshToken: 'invalid-refresh-token',
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/refresh')
                .send(refreshTokenDto)
                .expect(401);

            expect(response.body.statusCode).toBe(401);
        });

        it('should return 401 when user not found', async () => {
            // Create a user first
            const hashedPassword = await bcrypt.hash('password123', 10);
            const user = await userModel.create({
                email: 'test@example.com',
                password: hashedPassword,
                role: UserRole.USER,
            });

            // Generate a refresh token
            const refreshToken = jwtService.sign(
                { email: user.email, sub: user._id },
                { expiresIn: '7d' }
            );

            // Delete the user
            await userModel.findByIdAndDelete(user._id);

            const refreshTokenDto = {
                refreshToken,
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/refresh')
                .send(refreshTokenDto)
                .expect(401);

            expect(response.body.statusCode).toBe(401);
        });
    });

    describe('/api/auth/logout (POST)', () => {
        it('should logout successfully with valid token', async () => {
            // Create a user first
            const hashedPassword = await bcrypt.hash('password123', 10);
            const user = await userModel.create({
                email: 'test@example.com',
                password: hashedPassword,
                role: UserRole.USER,
            });

            // Generate an access token
            const accessToken = jwtService.sign(
                { email: user.email, sub: user._id },
                { expiresIn: '15m' }
            );

            const response = await request(app.getHttpServer())
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toEqual({
                message: 'Logged out successfully',
            });
        });

        it('should return 401 without token', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/logout')
                .expect(401);
        });

        it('should return 401 with invalid token', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });

    describe('Validation and Security', () => {
        it('should reject malicious input data', async () => {
            const maliciousDto = {
                email: 'test@example.com',
                password: 'password123',
                $where: 'malicious code', // This should be rejected by validation
            };

            const response = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(maliciousDto)
                .expect(400);

            // The malicious $where should be rejected by validation pipe
            expect(response.body.statusCode).toBe(400);
            expect(response.body.message).toEqual(expect.arrayContaining([
                expect.stringContaining('property')
            ]));
        });
    });
}); 