import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
import { eq, and, inArray, between, like } from 'drizzle-orm';
import { PaginationOptions, ProductFilters } from '@/common/contracts/filters';

@Injectable()
export class CatalogRepository {
    constructor(
        @Inject('DB_DRIZZLE')
        private drizzleDev: PostgresJsDatabase<typeof schema>,
    ) {}

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ): Promise<(typeof schema.products.$inferSelect)[]> {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;

        let conditions = [
            eq(schema.products.isVisible, true),
            eq(schema.products.isArchived, false),
        ];

        if (filters.categories && filters.categories.length > 0) {
            conditions.push(inArray(schema.products.pcid, filters.categories));
        }

        if (filters.priceRange) {
            conditions.push(
                between(
                    schema.products.baseVolume,
                    filters.priceRange.min,
                    filters.priceRange.max,
                ),
            );
        }

        if (filters.brands && filters.brands.length > 0) {
            conditions.push(inArray(schema.products.brandId, filters.brands));
        }

        if (filters.countries && filters.countries.length > 0) {
            conditions.push(
                inArray(schema.products.countryId, filters.countries),
            );
        }

        if (filters.vendors && filters.vendors.length > 0) {
            conditions.push(
                inArray(schema.products.vendorOwnerId, filters.vendors),
            );
        }

        if (filters.productVariant) {
            conditions.push(
                eq(schema.products.productVariant, filters.productVariant),
            );
        }

        if (filters.name) {
            conditions.push(
                like(schema.products.productSlug, `%${filters.name}%`),
            );
        }

        if (filters.articleNumber) {
            conditions.push(
                like(
                    schema.products.articleNumber,
                    `%${filters.articleNumber}%`,
                ),
            );
        }

        const query = this.drizzleDev
            .select()
            .from(schema.products)
            .where(and(...conditions))
            .offset(offset)
            .limit(limit);

        return query.execute();
    }
}
