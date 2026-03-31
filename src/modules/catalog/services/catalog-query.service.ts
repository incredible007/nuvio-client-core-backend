import { Inject, Injectable } from '@nestjs/common'
import { CatalogFilterService } from './catalog-filter.service'
import { CatalogCacheService } from './catalog-cache.service'
import { FilterScope } from '@/modules/catalog/interfaces/filter-strategy.interface'
import {
    CATALOG_REPOSITORY,
    ICatalogRepository,
} from '@/modules/catalog/interfaces/catalog-repository.interface'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { ProductFilters } from '@/modules/catalog/dto/product-filters'
import { Product } from '@/modules/catalog/interfaces/product.interface'
import { RecommendedProductsFilters } from '@/modules/catalog/dto/recommended-filters'

@Injectable()
export class CatalogQueryService {
    constructor(
        @Inject(CATALOG_REPOSITORY)
        private readonly repository: ICatalogRepository,
        private readonly filterService: CatalogFilterService,
        private readonly cacheService: CatalogCacheService,
    ) {}

    async fetchRecommendedProducts(
        dto: RecommendedProductsFilters,
        pagination: PaginationOptions,
    ): Promise<Product[]> {
        return this.fetchWithCache(
            dto,
            pagination,
            FilterScope.RECOMMENDED_PRODUCTS,
        )
    }

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<Product[]> {
        return this.fetchWithCache(
            filters,
            pagination,
            FilterScope.PRODUCTS_LIST,
        )
    }

    private async fetchWithCache(
        dto: object,
        pagination: PaginationOptions,
        scope: FilterScope,
    ): Promise<Product[]> {
        const cacheKey = this.cacheService.buildKey(dto, pagination)

        const cached = await this.cacheService.get<Product[]>(cacheKey)
        if (cached) return cached

        const baseConditions = this.filterService.buildBaseConditions()
        const filterConditions = this.filterService.build(dto, scope)

        const result = await this.repository.fetchProducts(
            [...baseConditions, ...filterConditions],
            pagination,
        )

        await this.cacheService.set(cacheKey, result)
        return result
    }
}
