import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'

export class CacheKeyFactory {
    static forProducts(
        filters: ProductFiltersDto,
        pagination: PaginationOptions,
    ): string {
        return `catalog:products:${JSON.stringify({ filters, pagination })}`
    }

    static forProduct(id: number): string {
        return `catalog:product:${id}`
    }

    static forRecommended(
        pid: number,
        pagination: PaginationOptions,
        filters?: ProductFiltersDto,
    ): string {
        return `recommended:${pid}:${JSON.stringify({ pagination, filters })}`
    }
}
