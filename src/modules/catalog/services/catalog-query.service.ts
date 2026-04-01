import { Inject, Injectable } from '@nestjs/common'
import { CatalogFilterService } from './catalog-filter.service'
import { CatalogCacheService } from './catalog-cache.service'
import { FilterScope } from '@/modules/catalog/interfaces/filter-strategy.interface'
import {
    CATALOG_REPOSITORY,
    ICatalogRepository,
} from '@/modules/catalog/interfaces/catalog-repository.interface'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { Product } from '@/modules/catalog/interfaces/product.interface'
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
        pid: number,
        pagination: PaginationOptions,
        filters?: ProductFiltersDto,
    ): Promise<Product[]> {
        return this.withCache(
            this.cacheService.buildKey(pid, 'recommended', pagination, filters),
            () => {
                const baseConditions = this.filterService.buildBaseConditions()
                const filterConditions = this.filterService.build(
                    filters,
                    FilterScope.PRODUCTS_LIST,
                )

                return this.repository.fetchProducts(
                    [
                        ...baseConditions,
                        ...filterConditions,
                        eq(schema.recommendedProducts.productId, pid),
                    ],
                    pagination,
                )
            },
        )
    }

    async fetchProducts(
        filters: ProductFiltersDto,
        pagination: PaginationOptions,
    ): Promise<Product[]> {
        return this.withCache(
            this.cacheService.buildKey(filters, pagination),
            () => {
                const baseConditions = this.filterService.buildBaseConditions()
                const filterConditions = this.filterService.build(
                    filters,
                    FilterScope.PRODUCTS_LIST,
                )

                return this.repository.fetchProducts(
                    [...baseConditions, ...filterConditions],
                    pagination,
                )
            },
        )
    }

    async fetchProduct(pid: number): Promise<Product> {
        return this.withCache(
            this.cacheService.buildKey(pid, 'product'),
            () => {
                const baseConditions = this.filterService.buildBaseConditions()
                const currConditions = [eq(schema.products.pid, pid)]

                return this.repository.fetchProduct([
                    ...baseConditions,
                    ...currConditions,
                ])
            },
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
}
