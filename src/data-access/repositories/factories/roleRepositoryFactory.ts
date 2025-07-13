import { config } from '../../../config/env';
import { roleRepository } from '../mongo/roleRepository';
import { PostgreSQLRoleRepository } from '../postgresql/postgresqlRoleRepository';

export interface IRoleRepository {
    create(roleData: any): Promise<any>;
    findById(id: string): Promise<any | null>;
    findByName(name: string): Promise<any | null>;
    update(id: string, updateData: any): Promise<any | null>;
    remove(id: string): Promise<any | null>;
    find(filter?: any, options?: any): Promise<any[]>;
}

export class RoleRepositoryFactory {
    static create(): IRoleRepository {
        const dbType = config.database.type.toLowerCase();
        switch (dbType) {
            case 'mongodb':
                return roleRepository;
            case 'postgresql':
                return new PostgreSQLRoleRepository();
            default:
                throw new Error(`Unsupported database type: ${dbType}`);
        }
    }
} 