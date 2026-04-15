import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CacheKeyFactory } from '@/modules/catalog/factory/cache-key.factory'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'

@Injectable()
export class CatalogCacheService {
    private readonly TTL = 300_000 // 5 minutes

    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async get<T>(key: string): Promise<T | null> {
        const result = await this.cache.get<T>(key)
        return result !== undefined ? result : null
    }

    async set<T>(key: string, value: T): Promise<void> {
        await this.cache.set(key, value, this.TTL)
    }

    async invalidateProducts(
        filters: ProductFiltersDto,
        pagination: PaginationOptions,
    ): Promise<void> {
        const key = this.buildKey(filters, pagination)
        await this.cache.del(key)
    }

    buildKey(id: number, scope: 'product'): string
    buildKey(
        id: number,
        scope: 'recommended',
        pagination: PaginationOptions,
        filters?: ProductFiltersDto,
    ): string
    buildKey(filters: ProductFiltersDto, pagination: PaginationOptions): string
    buildKey(scope: 'search', query: string, pagination: PaginationOptions): string
    buildKey(
        filtersOrIdOrScope: ProductFiltersDto | number | 'search',
        scopeOrPaginationOrQuery?: 'product' | 'recommended' | PaginationOptions | string,
        pagination?: PaginationOptions,
        filters?: ProductFiltersDto,
    ): string {
        if (filtersOrIdOrScope === 'search') {
            return CacheKeyFactory.forSearch(scopeOrPaginationOrQuery as string, pagination!)
        }
        if (typeof filtersOrIdOrScope === 'number') {
            if (scopeOrPaginationOrQuery === 'recommended') {
                return CacheKeyFactory.forRecommended(filtersOrIdOrScope, pagination!, filters)
            }
            return CacheKeyFactory.forProduct(filtersOrIdOrScope)
        }
        return CacheKeyFactory.forProducts(
            filtersOrIdOrScope,
            scopeOrPaginationOrQuery as PaginationOptions,
        )
    }
}
