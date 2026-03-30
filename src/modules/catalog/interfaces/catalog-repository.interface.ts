import { ProductFilters } from '@/modules/catalog/dto/filters'
import * as schema from '@/database/schema'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'

export interface ICatalogRepository {
    getProductsByFilters(
        conditions: SQL[],
        pagination: PaginationOptions,
    ): Promise<(typeof schema.products.$inferSelect)[]>
}

export const CATALOG_REPOSITORY = Symbol('ICatalogRepository')
