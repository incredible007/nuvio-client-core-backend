import { Inject, Injectable, Logger } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CatalogRepository } from './catalog.repository'
import type { ProductFilters } from '@/modules/catalog/dto/filters'
import * as schema from '../../database/schema'
import { CacheKeyFactory } from '@/modules/catalog/factory/cache-key.factory'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { Counter, Histogram } from 'prom-client'

@Injectable()
export class CatalogService {
    private readonly logger = new Logger(CatalogService.name)

    constructor(
        private readonly catalogRepository: CatalogRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectMetric('catalog_cache_hits_total')
        private readonly cacheHitsCounter: Counter,
        @InjectMetric('catalog_query_duration_seconds')
        private readonly queryDuration: Histogram,
    ) {}

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<(typeof schema.products.$inferSelect)[]> {
        const cacheKey = CacheKeyFactory.forProducts(filters, pagination)

        const cached =
            await this.cacheManager.get<
                (typeof schema.products.$inferSelect)[]
            >(cacheKey)

        if (cached) {
            this.cacheHitsCounter.inc({ status: 'hit' })
            this.logger.debug(`Cache HIT: ${cacheKey}`)
            return cached
        }

        this.cacheHitsCounter.inc({ status: 'miss' })
        this.logger.debug(`Cache MISS: ${cacheKey}`)

        const end = this.queryDuration.startTimer()
        const start = Date.now()
        const result = await this.catalogRepository.getProductsByFilters(
            filters,
            pagination,
        )
        this.logger.log(
            `getProductsByFilters took ${Date.now() - start}ms, returned ${result.length} items`,
        )
        end()

        await this.cacheManager.set(cacheKey, result)

        return result
    }
}
