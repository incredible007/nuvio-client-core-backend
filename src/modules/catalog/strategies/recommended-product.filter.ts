import { Injectable } from '@nestjs/common'
import { SQL, eq } from 'drizzle-orm'
import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'
import { RecommendedProductsDto } from '@/modules/catalog/dto/recommended.dto'
import * as schema from '@/database/schema'

@Injectable()
export class RecommendedProductFilterStrategy implements FilterStrategy<RecommendedProductsDto> {
    readonly scopes = [FilterScope.RECOMMENDED_PRODUCTS]

    apply(filters: RecommendedProductsDto): SQL | undefined {
        return eq(schema.recommendedProducts.productId, filters.pid)
    }
}
