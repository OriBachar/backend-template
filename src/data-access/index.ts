// Export base repository
export { createRepository } from './repositories/baseRepository';

// Export individual repositories
export { userRepository } from './repositories/mongo/userRepository';
export { roleRepository } from './repositories/mongo/roleRepository';
export { permissionRepository } from './repositories/mongo/permissionRepository';
export { profileRepository } from './repositories/mongo/profileRepository';

// Export repository factories
export { UserRepositoryFactory } from './repositories/factories/userRepositoryFactory';
export { RoleRepositoryFactory } from './repositories/factories/roleRepositoryFactory';
export { PermissionRepositoryFactory } from './repositories/factories/permissionRepositoryFactory';
export { ProfileRepositoryFactory } from './repositories/factories/profileRepositoryFactory';

// Export PostgreSQL repositories
export { PostgreSQLUserRepository } from './repositories/postgresql/postgresqlUserRepository';
export { PostgreSQLRoleRepository } from './repositories/postgresql/postgresqlRoleRepository';
export { PostgreSQLPermissionRepository } from './repositories/postgresql/postgresqlPermissionRepository';
export { PostgreSQLProfileRepository } from './repositories/postgresql/postgresqlProfileRepository';