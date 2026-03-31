import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { ProductFilters } from '@/modules/catalog/dto/product-filters'
import { eq, SQL } from 'drizzle-orm'
import { products } from '@/database/schema'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductVariantFilter implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH]
    apply(filters: ProductFilters): SQL | undefined {
        if (!filters.productVariant) return undefined
        return eq(products.productVariant, filters.productVariant)
    }
}
