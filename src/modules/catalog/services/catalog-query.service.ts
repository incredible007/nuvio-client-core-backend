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
import { eq } from 'drizzle-orm'
import * as schema from '@/database/schema'

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
        return this.fetchProductsWithCache(
            dto,
            pagination,
            FilterScope.RECOMMENDED_PRODUCTS,
        )
    }

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<Product[]> {
        return this.fetchProductsWithCache(
            filters,
            pagination,
            FilterScope.PRODUCTS_LIST,
        )
    }

    private async withCache<T>(
        key: string,
        fetcher: () => Promise<T>,
    ): Promise<T> {
        const cached = await this.cacheService.get<T>(key)
        if (cached) return cached
        const result = await fetcher()
        await this.cacheService.set(key, result)
        return result
    }

    async fetchProduct(pid: number): Promise<Product> {
        return this.withCache(this.cacheService.buildKey(pid), () => {
            const baseConditions = this.filterService.buildBaseConditions()
            const currConditions = [eq(schema.products.pid, pid)]

            return this.repository.fetchProduct([
                ...baseConditions,
                ...currConditions,
            ])
        })
    }

    private async fetchProductsWithCache(
        dto: object,
        pagination: PaginationOptions,
        scope: FilterScope,
    ): Promise<Product[]> {
        return this.withCache(
            this.cacheService.buildKey(dto, pagination),
            () => {
                const baseConditions = this.filterService.buildBaseConditions()
                const filterConditions = this.filterService.build(dto, scope)

                return this.repository.fetchProducts(
                    [...baseConditions, ...filterConditions],
                    pagination,
                )
            },
        )
    }
}
