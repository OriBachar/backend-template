import { IUser } from '../../types/user';
import { User } from '../../models/User';
import { AppError } from '../../types/error';
import { BaseRepository } from './baseRepository';

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            return await this.findOne({ email });
        } catch (error) {
            throw new AppError('Failed to find user by email', 500, true, { error });
        }
    }

    async exists(email: string): Promise<boolean> {
        try {
            const user = await this.findOne({ email });
            return !!user;
        } catch (error) {
            throw new AppError('Failed to check user existence', 500, true, { error });
        }
    }
}
