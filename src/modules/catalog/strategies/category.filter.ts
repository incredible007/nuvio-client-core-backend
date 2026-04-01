import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { Injectable } from '@nestjs/common'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { inArray, SQL } from 'drizzle-orm'
import * as schema from '@/database/schema'

@Injectable()
export class CategoryFilterStrategy implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH]
    apply(filters: ProductFiltersDto): SQL | undefined {
        if (!filters.categories?.length) return undefined
        return inArray(schema.products.pcid, filters.categories)
    }
}
