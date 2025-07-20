import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.validateUser(email, password);
        if (user) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user._id };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(email: string, password: string) {
        const user = await this.usersService.create(email, password);
        const { password: _, ...result } = user.toObject();
        return result;
    }

    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const newPayload = { email: user.email, sub: user._id };
            const newAccessToken = this.jwtService.sign(newPayload);
            const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
            
            return {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
} 