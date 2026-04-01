import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { eq, SQL } from 'drizzle-orm'
import { products } from '@/database/schema'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ArticleNumberFilter implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH]

    apply(filters: ProductFiltersDto): SQL | undefined {
        if (!filters.articleNumber) return undefined
        return eq(products.articleNumber, filters.articleNumber)
    }
}
