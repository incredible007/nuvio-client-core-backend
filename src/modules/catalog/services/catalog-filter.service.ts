import { Inject, Injectable } from '@nestjs/common'
import {
    FILTER_STRATEGIES,
    FilterScope,
    FilterStrategy,
} from '../interfaces/filter-strategy.interface'
import * as schema from '../../../database/schema'
import { eq, SQL } from 'drizzle-orm'

@Injectable()
export class CatalogFilterService {
    constructor(
        @Inject(FILTER_STRATEGIES)
        private readonly filterStrategies: FilterStrategy[],
    ) {}

    build<T>(filters: T, scope: FilterScope): SQL[] {
        return this.filterStrategies
            .filter((strategy) => strategy.scopes.includes(scope))
            .map((strategy) => strategy.apply(filters as any))
            .filter((sql): sql is SQL => sql !== undefined)
    }

    buildBaseConditions(): SQL[] {
        return [
            eq(schema.products.isVisible, true),
            eq(schema.products.isArchived, false),
        ]
    }
}
