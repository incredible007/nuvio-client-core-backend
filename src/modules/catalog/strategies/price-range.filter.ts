import { Injectable } from '@nestjs/common'
import { between, SQL } from 'drizzle-orm'
import {
    FilterScope,
    FilterStrategy,
} from '../interfaces/filter-strategy.interface'
import { ProductFilters } from '../dto/product-filters'
import * as schema from '@/database/schema'

@Injectable()
export class PriceRangeFilterStrategy implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH]
    apply(filters: ProductFilters): SQL | undefined {
        if (!filters.priceRange) return undefined
        return between(
            schema.products.baseVolume,
            filters.priceRange.min,
            filters.priceRange.max,
        )
    }
}
