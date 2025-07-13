import { config } from '../../../config/env';
import { permissionRepository } from '../mongo/permissionRepository';
import { PostgreSQLPermissionRepository } from '../postgresql/postgresqlPermissionRepository';

export interface IPermissionRepository {
    create(permissionData: any): Promise<any>;
    findById(id: string): Promise<any | null>;
    findByName(name: string): Promise<any | null>;
    update(id: string, updateData: any): Promise<any | null>;
    remove(id: string): Promise<any | null>;
    find(filter?: any, options?: any): Promise<any[]>;
}

export class PermissionRepositoryFactory {
    static create(): IPermissionRepository {
        const dbType = config.database.type.toLowerCase();
        switch (dbType) {
            case 'mongodb':
                return permissionRepository;
            case 'postgresql':
                return new PostgreSQLPermissionRepository();
            default:
                throw new Error(`Unsupported database type: ${dbType}`);
        }
    }
} 