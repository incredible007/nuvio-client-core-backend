import { ProductFilters } from '@/modules/catalog/dto/filters'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'

export class CacheKeyFactory {
    static forProducts(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): string {
        return `catalog:products:${JSON.stringify({ filters, pagination })}`
    }

    static forProduct(id: number): string {
        return `catalog:product:${id}`
    }
}
