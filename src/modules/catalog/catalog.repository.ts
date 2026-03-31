import { Inject, Injectable } from '@nestjs/common'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../database/schema'
import { and, eq, getTableColumns, inArray, sql, SQL } from 'drizzle-orm'
import { ICatalogRepository } from '@/modules/catalog/interfaces/catalog-repository.interface'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { DB_DRIZZLE } from '@/database/database.module'
import { Product } from '@/modules/catalog/interfaces/product.interface'

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
            const batch = await this.fetchProducts(conditions, {
                page,
                limit: batchSize,
            })
            if (batch.length === 0) break
            yield batch
            if (batch.length < batchSize) break
            page++
        }
    }

    async fetchProducts(
        conditions: SQL[],
        pagination: PaginationOptions,
    ): Promise<Product[]> {
        const { page, limit } = pagination
        const offset = (page - 1) * limit

        const whereCondition =
            conditions.length > 0 ? and(...conditions) : undefined

        const rows = await this.db
            .select({
                ...getTableColumns(schema.products),
                vendor: getTableColumns(schema.vendors),
                category: getTableColumns(schema.productCategories),
                brand: getTableColumns(schema.dBrands),
                country: getTableColumns(schema.dCountries),
            })
            .from(schema.products)
            .leftJoin(
                schema.vendors,
                eq(schema.products.vendorOwnerId, schema.vendors.vid),
            )
            .leftJoin(
                schema.productCategories,
                eq(schema.productCategories.pcid, schema.products.pcid),
            )
            .leftJoin(
                schema.dBrands,
                eq(schema.dBrands.id, schema.products.brandId),
            )
            .leftJoin(
                schema.dCountries,
                eq(schema.dCountries.id, schema.products.countryId),
            )
            .where(whereCondition)
            .offset(offset)
            .limit(limit)

        const categoryIds = [
            ...new Set(rows.map((r) => r.category?.pcid).filter(Boolean)),
        ] as number[]

        const brandIds = [
            ...new Set(rows.map((r) => r.brand?.id).filter(Boolean)),
        ] as number[]

        const countryIds = [
            ...new Set(rows.map((r) => r.country?.id).filter(Boolean)),
        ] as number[]

        const productIds = [...new Set(rows.map((r) => r.pid))] as number[]

        const [categoryLocs, brandLocs, countryLocs, productMedia] =
            await Promise.all([
                categoryIds.length
                    ? this.db
                          .select()
                          .from(schema.productCategoryLocalizations)
                          .where(
                              inArray(
                                  schema.productCategoryLocalizations.pcid,
                                  categoryIds,
                              ),
                          )
                    : [],
                brandIds.length
                    ? this.db
                          .select()
                          .from(schema.dBrandValuesLocalizations)
                          .where(
                              inArray(
                                  schema.dBrandValuesLocalizations.id,
                                  brandIds,
                              ),
                          )
                    : [],
                countryIds.length
                    ? this.db
                          .select()
                          .from(schema.dCountryValuesLocalizations)
                          .where(
                              inArray(
                                  schema.dCountryValuesLocalizations.id,
                                  countryIds,
                              ),
                          )
                    : [],
                this.db
                    .select({
                        ...getTableColumns(schema.productMedia),
                        media: getTableColumns(schema.media),
                    })
                    .from(schema.productMedia)
                    .where(inArray(schema.productMedia.pid, productIds)),
            ])

        const categoryLocMap = Map.groupBy(categoryLocs, (l) => l.pcid)
        const brandLocMap = Map.groupBy(brandLocs, (l) => l.id)
        const countryLocMap = Map.groupBy(countryLocs, (l) => l.id)

        return rows.map(({ category, vendor, brand, country, ...product }) => ({
            ...product,
            vendor,
            category: category?.pcid
                ? {
                      ...category,
                      localizations: categoryLocMap.get(category.pcid) ?? [],
                  }
                : null,
            brand: brand?.id
                ? {
                      ...brand,
                      localizations: brandLocMap.get(brand.id) ?? [],
                  }
                : null,
            country: country?.id
                ? {
                      ...country,
                      localizations: countryLocMap.get(country.id) ?? [],
                  }
                : null,
            productMedia: productMedia,
        }))
    }
}
