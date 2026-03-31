import { Inject, Injectable } from '@nestjs/common'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../database/schema'
import { and, SQL } from 'drizzle-orm'
import { ICatalogRepository } from '@/modules/catalog/interfaces/catalog-repository.interface'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { DB_DRIZZLE } from '@/database/database.module'

@Injectable()
export class CatalogRepository implements ICatalogRepository {
    constructor(
        @Inject(DB_DRIZZLE)
        private readonly db: PostgresJsDatabase<typeof schema>,
    ) {}

    async *getProductsCursor(
        conditions: SQL[],
        batchSize = 100,
    ): AsyncGenerator<(typeof schema.products.$inferSelect)[]> {
        let page = 1
        while (true) {
            const batch = await this.getProductsByFilters(conditions, {
                page,
                limit: batchSize,
            })
            if (batch.length === 0) break
            yield batch
            if (batch.length < batchSize) break
            page++
        }
    }

    async getProductsByFilters(
        conditions: SQL[],
        pagination: PaginationOptions,
    ): Promise<(typeof schema.products.$inferSelect)[]> {
        const { page, limit } = pagination
        const offset = (page - 1) * limit

        const whereCondition =
            conditions.length > 0 ? and(...conditions) : undefined

        return this.db
            .select()
            .from(schema.products)
            .where(whereCondition)
            .offset(offset)
            .limit(limit)
            .execute()
    }
}
