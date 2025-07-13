import { config } from '../../../config/env';
import { userRepository } from '../mongo/userRepository';
import { PostgreSQLUserRepository } from '../postgresql/postgresqlUserRepository';

export interface IUserRepository {
    create(userData: any): Promise<any>;
    findByEmail(email: string): Promise<any | null>;
    findById(id: string): Promise<any | null>;
    update(id: string, updateData: any): Promise<any | null>;
    remove(id: string): Promise<any | null>;
    find(filter?: any, options?: any): Promise<any[]>;
    exists(email: string): Promise<boolean>;
}

export class UserRepositoryFactory {
    static create(): IUserRepository {
        const dbType = config.database.type.toLowerCase();
        
        switch (dbType) {
            case 'mongodb':
                return userRepository;
            case 'postgresql':
                return new PostgreSQLUserRepository();
            default:
                throw new Error(`Unsupported database type: ${dbType}`);
        }
    }
} 