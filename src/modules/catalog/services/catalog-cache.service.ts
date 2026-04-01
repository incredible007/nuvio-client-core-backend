import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CacheKeyFactory } from '@/modules/catalog/factory/cache-key.factory'
import { ProductFilters } from '@/modules/catalog/dto/product-filters'
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
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<void> {
        const key = this.buildKey(filters, pagination)
        await this.cache.del(key)
    }

    buildKey(id: number): string
    buildKey(filters: ProductFilters, pagination: PaginationOptions): string
    buildKey(
        filtersOrId: ProductFilters | number,
        pagination?: PaginationOptions,
    ): string {
        if (typeof filtersOrId === 'number') {
            return CacheKeyFactory.forProduct(filtersOrId)
        }
        return CacheKeyFactory.forProducts(filtersOrId, pagination!)
    }
}
