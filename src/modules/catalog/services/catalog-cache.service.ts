import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CacheKeyFactory } from '@/modules/catalog/factory/cache-key.factory'

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

    buildKey(filters: any, pagination: any): string {
        return CacheKeyFactory.forProducts(filters, pagination)
    }
}
