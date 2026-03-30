import { Injectable } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import type {
    ProductFilters,
    PaginationOptions,
} from '@/common/contracts/filters';
import * as schema from '../../database/schema';

@Injectable()
export class CatalogService {
    constructor(private readonly catalogRepository: CatalogRepository) {}

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<(typeof schema.products.$inferSelect)[]> {
        return this.catalogRepository.getProductsByFilters(filters, pagination);
    }
}
