import { Injectable } from '@nestjs/common'
import { SQL, eq } from 'drizzle-orm'
import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { RecommendedProductsFilters } from '@/modules/catalog/dto/recommended-filters'
import * as schema from '@/database/schema'

@Injectable()
export class RecommendedProductFilterStrategy implements FilterStrategy<RecommendedProductsFilters> {
    readonly scopes = [FilterScope.RECOMMENDED_PRODUCTS]

    apply(filters: RecommendedProductsFilters): SQL | undefined {
        return eq(schema.recommendedProducts.productId, filters.pid)
    }
}
