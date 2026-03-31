import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { ProductFilters } from '@/modules/catalog/dto/product-filters'
import { like, SQL } from 'drizzle-orm'
import { products } from '@/database/schema'
import { Injectable } from '@nestjs/common'
import { CategoryFilterStrategy } from '@/modules/catalog/strategies/category.filter'

@Injectable()
export class NameFilterStrategy implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH]
    apply(filters: ProductFilters): SQL | undefined {
        if (!filters.name) return undefined
        return like(products.productSlug, `%${filters.name}%`)
    }
}
