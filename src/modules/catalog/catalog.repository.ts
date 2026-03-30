import { Inject, Injectable } from '@nestjs/common'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../database/schema'
import { eq, and, SQL } from 'drizzle-orm'
import { ProductFilters } from '@/modules/catalog/dto/filters'
import { ICatalogRepository } from '@/modules/catalog/interfaces/catalog-repository.interface'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import {
    FILTER_STRATEGIES,
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface'

@Injectable()
export class CatalogRepository implements ICatalogRepository {
    constructor(
        @Inject('DB_DRIZZLE')
        private readonly drizzleDev: PostgresJsDatabase<typeof schema>,
        @Inject(FILTER_STRATEGIES)
        private readonly filterStrategies: FilterStrategy[],
    ) {}

    async *getProductsCursor(
        filters: ProductFilters,
        batchSize = 100,
    ): AsyncGenerator<(typeof schema.products.$inferSelect)[]> {
        let page = 1
        while (true) {
            const batch = await this.getProductsByFilters(filters, {
                page,
                limit: batchSize,
            })
            if (batch.length === 0) break
            yield batch
            if (batch.length < batchSize) break
            page++
        }
    }

    private applyStrategies(
        filters: ProductFilters,
        scope: FilterScope,
    ): SQL[] {
        return this.filterStrategies
            .filter((strategy) => strategy.scopes.includes(scope))
            .map((strategy) => strategy.apply(filters))
            .filter((sql): sql is SQL => sql !== undefined)
    }

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<(typeof schema.products.$inferSelect)[]> {
        const { page, limit } = pagination
        const offset = (page - 1) * limit

        const baseConditions: SQL[] = [
            eq(schema.products.isVisible, true),
            eq(schema.products.isArchived, false),
        ]

        const filterConditions = this.applyStrategies(
            filters,
            FilterScope.PRODUCTS_LIST,
        )

        return this.drizzleDev
            .select()
            .from(schema.products)
            .where(and(...baseConditions, ...filterConditions))
            .offset(offset)
            .limit(limit)
            .execute()
    }
}
