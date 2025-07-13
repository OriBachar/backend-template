import { config } from '../../../config/env';
import { profileRepository } from '../mongo/profileRepository';
import { PostgreSQLProfileRepository } from '../postgresql/postgresqlProfileRepository';

export interface IProfileRepository {
    create(profileData: any): Promise<any>;
    findById(id: string): Promise<any | null>;
    findByUserId(userId: string): Promise<any | null>;
    update(id: string, updateData: any): Promise<any | null>;
    remove(id: string): Promise<any | null>;
    find(filter?: any, options?: any): Promise<any[]>;
}

export class ProfileRepositoryFactory {
    static create(): IProfileRepository {
        const dbType = config.database.type.toLowerCase();
        switch (dbType) {
            case 'mongodb':
                return profileRepository;
            case 'postgresql':
                return new PostgreSQLProfileRepository();
            default:
                throw new Error(`Unsupported database type: ${dbType}`);
        }
    }
} 