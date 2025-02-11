import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { AppError } from '../../types/error';

export class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw new AppError('Failed to create document', 500, true, { error });
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw new AppError('Failed to find document by id', 500, true, { error });
        }
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            throw new AppError('Failed to find document', 500, true, { error });
        }
    }

    async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
        try {
            return await this.model.find(filter, null, options);
        } catch (error) {
            throw new AppError('Failed to find documents', 500, true, { error });
        }
    }

    async update(id: string, update: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, update, { new: true });
        } catch (error) {
            throw new AppError('Failed to update document', 500, true, { error });
        }
    }

    async delete(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new AppError('Failed to delete document', 500, true, { error });
        }
    }
}