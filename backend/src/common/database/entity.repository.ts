import {
  Document,
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { FilterDto } from '../dto';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: PaginateModel<T>) {}

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findOne(filterQuery, projection, options).exec();
  }

  async findOneById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findById(id, projection, options).exec();
  }

  async find(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.entityModel.find(filter, projection, options).exec();
  }

  async findPaginate(filter: FilterDto<T>, options?: PaginateOptions): Promise<PaginateResult<T>> {
    const { data, limit, page } = filter;
    return await this.entityModel.paginate(data, {
      limit,
      page,
      ...options,
    });
  }

  async create(createDto: unknown): Promise<T> {
    const doc = new this.entityModel(createDto);
    return doc.save();
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    updateData: UpdateQuery<unknown>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(filter, updateData, options).exec();
  }

  async findByIdAndUpdate(
    id: string,
    updateData: UpdateQuery<unknown>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    return this.entityModel.findByIdAndUpdate(id, updateData, options).exec();
  }

  async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
    return this.entityModel.findOneAndDelete(filter).exec();
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    return this.entityModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.entityModel.deleteMany(filter);
    return result.deletedCount >= 1;
  }
}
