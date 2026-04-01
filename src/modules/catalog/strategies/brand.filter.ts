import { Injectable } from '@nestjs/common'
import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { inArray, SQL } from 'drizzle-orm'
import * as schema from '@/database/schema'

@Injectable()
export class BrandFilterStrategy implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST]
    apply(filters: ProductFiltersDto): SQL | undefined {
        if (!filters.brands?.length) return undefined
        return inArray(schema.products.brandId, filters.brands)
    }
}
