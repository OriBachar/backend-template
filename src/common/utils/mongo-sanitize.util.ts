import * as mongoSanitize from 'mongo-sanitize';

export class MongoSanitizeUtil {
    /**
     * Sanitize an object to remove MongoDB operators
     * @param obj - The object to sanitize
     * @returns The sanitized object
     */
    static sanitize<T>(obj: T): T {
        return mongoSanitize(obj);
    }

    /**
     * Sanitize query parameters (for use in services)
     * @param query - The query object to sanitize
     * @returns The sanitized query object
     */
    static sanitizeQuery(query: any): any {
        if (!query) return query;

        const sanitized = { ...query };
        return mongoSanitize(sanitized);
    }

    /**
     * Check if an object contains MongoDB operators
     * @param obj - The object to check
     * @returns True if the object contains MongoDB operators
     */
    static hasMongoOperators(obj: any): boolean {
        if (!obj || typeof obj !== 'object') return false;

        const dangerousKeys = ['$where', '$ne', '$gt', '$lt', '$gte', '$lte', '$in', '$nin', '$regex', '$options'];

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Check if key starts with $
                if (key.startsWith('$')) return true;

                // Check if key contains dangerous MongoDB operators
                if (dangerousKeys.includes(key)) return true;

                // Recursively check nested objects
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (this.hasMongoOperators(obj[key])) return true;
                }
            }
        }

        return false;
    }
} 