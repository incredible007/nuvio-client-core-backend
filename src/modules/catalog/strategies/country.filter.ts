import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { inArray, SQL } from 'drizzle-orm'
import * as schema from '@/database/schema'
import { Injectable } from '@nestjs/common'
import { CategoryFilterStrategy } from '@/modules/catalog/strategies/category.filter'

@Injectable()
export class CountryFilterStrategy implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH]
    apply(filters: ProductFiltersDto): SQL | undefined {
        if (!filters.countries?.length) return undefined
        return inArray(schema.products.countryId, filters.countries)
    }
}
