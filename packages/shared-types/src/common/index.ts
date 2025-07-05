export * from './error';

export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data?: T;
    errors?: any[];
}

export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
} 