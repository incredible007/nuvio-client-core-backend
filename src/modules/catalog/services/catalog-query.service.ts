import { Inject, Injectable } from '@nestjs/common'
import { CatalogFilterService } from './catalog-filter.service'
import { CatalogCacheService } from './catalog-cache.service'
import * as schema from '../../../database/schema'
import { FilterScope } from '@/modules/catalog/interfaces/filter-strategy.interface'
import {
    CATALOG_REPOSITORY,
    ICatalogRepository,
} from '@/modules/catalog/interfaces/catalog-repository.interface'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { ProductFilters } from '@/modules/catalog/dto/filters'

@Injectable()
export class CatalogQueryService {
    constructor(
        @Inject(CATALOG_REPOSITORY)
        private readonly repository: ICatalogRepository,
        private readonly filterService: CatalogFilterService,
        private readonly cacheService: CatalogCacheService,
    ) {}

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<(typeof schema.products.$inferSelect)[]> {
        const cacheKey = this.cacheService.buildKey(filters, pagination)

        const cached =
            await this.cacheService.get<
                (typeof schema.products.$inferSelect)[]
            >(cacheKey)
        if (cached) return cached

        const baseConditions = this.filterService.buildBaseConditions()
        const filterConditions = this.filterService.build(
            filters,
            FilterScope.PRODUCTS_LIST,
        )

        const result = await this.repository.getProductsByFilters(
            [...baseConditions, ...filterConditions],
            pagination,
        )

        await this.cacheService.set(cacheKey, result)
        return result
    }
}
