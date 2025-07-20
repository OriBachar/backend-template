import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/services/auth.service';
import { UsersService } from '../../src/services/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from '../../src/schemas/user.schema';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: jest.Mocked<UsersService>;
    let jwtService: jest.Mocked<JwtService>;

    const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
        createdAt: new Date(),
        toObject: () => ({
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole.USER,
            createdAt: new Date(),
        }),
    } as User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        validateUser: jest.fn(),
                        create: jest.fn(),
                        findById: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get(UsersService);
        jwtService = module.get(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user without password when validation succeeds', async () => {
            usersService.validateUser.mockResolvedValue(mockUser);

            const result = await service.validateUser('test@example.com', 'password123');

            expect(result).toEqual({
                _id: '507f1f77bcf86cd799439011',
                email: 'test@example.com',
                role: UserRole.USER,
                createdAt: expect.any(Date),
            });
            expect(usersService.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        it('should return null when validation fails', async () => {
            usersService.validateUser.mockResolvedValue(null);

            const result = await service.validateUser('test@example.com', 'wrongpassword');

            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return tokens and user info', async () => {
            const mockAccessToken = 'access-token';
            const mockRefreshToken = 'refresh-token';

            jwtService.sign
                .mockReturnValueOnce(mockAccessToken)
                .mockReturnValueOnce(mockRefreshToken);

            const result = await service.login(mockUser);

            expect(result).toEqual({
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken,
                user: {
                    id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com',
                    role: UserRole.USER,
                },
            });

            expect(jwtService.sign).toHaveBeenCalledTimes(2);
        });
    });

    describe('register', () => {
        it('should create user and return user without password', async () => {
            usersService.create.mockResolvedValue(mockUser);

            const result = await service.register('test@example.com', 'password123');

            expect(result).toEqual({
                _id: '507f1f77bcf86cd799439011',
                email: 'test@example.com',
                role: UserRole.USER,
                createdAt: expect.any(Date),
            });

            expect(usersService.create).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    describe('refreshToken', () => {
        it('should return new tokens when refresh token is valid', async () => {
            const mockPayload = { email: 'test@example.com', sub: '507f1f77bcf86cd799439011' };
            const mockNewAccessToken = 'new-access-token';
            const mockNewRefreshToken = 'new-refresh-token';

            jwtService.verify.mockReturnValue(mockPayload);
            usersService.findById.mockResolvedValue(mockUser);
            jwtService.sign
                .mockReturnValueOnce(mockNewAccessToken)
                .mockReturnValueOnce(mockNewRefreshToken);

            const result = await service.refreshToken('valid-refresh-token');

            expect(result).toEqual({
                access_token: mockNewAccessToken,
                refresh_token: mockNewRefreshToken,
            });
        });

        it('should throw UnauthorizedException when refresh token is invalid', async () => {
            jwtService.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(service.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException when user not found', async () => {
            const mockPayload = { email: 'test@example.com', sub: '507f1f77bcf86cd799439011' };

            jwtService.verify.mockReturnValue(mockPayload);
            usersService.findById.mockResolvedValue(null);

            await expect(service.refreshToken('valid-token')).rejects.toThrow(UnauthorizedException);
        });
    });
}); 