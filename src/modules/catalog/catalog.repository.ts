import { Inject, Injectable } from '@nestjs/common'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../database/schema'
import { and, eq, getTableColumns, inArray, SQL } from 'drizzle-orm'
import { ICatalogRepository } from '@/modules/catalog/interfaces/catalog-repository.interface'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { DB_DRIZZLE } from '@/database/database.module'
import { Product } from '@/modules/catalog/interfaces/product.interface'
import { FilterResult } from '@/modules/catalog/interfaces/filter-strategy.interface'

@Injectable()
export class CatalogRepository implements ICatalogRepository {
    constructor(
        @Inject(DB_DRIZZLE)
        private readonly db: PostgresJsDatabase<typeof schema>,
    ) {}

    private resolveConditions(conditions: Array<SQL | FilterResult>): {
        where: SQL | undefined
        orderBy: SQL | undefined
    } {
        const whereClauses: SQL[] = []
        const orderByClauses: SQL[] = []

        for (const condition of conditions) {
            if (!condition) continue
            if (condition instanceof SQL) {
                whereClauses.push(condition)
            } else {
                if (condition.where) whereClauses.push(condition.where)
                if (condition.orderBy) orderByClauses.push(condition.orderBy)
            }
        }

        return {
            where: whereClauses.length > 0 ? and(...whereClauses) : undefined,
            orderBy: orderByClauses.length > 0 ? and(...orderByClauses) : undefined,
        }
    }

    async searchProducts(conditions: SQL[], pagination: PaginationOptions): Promise<Product[]> {
        const { page, limit } = pagination
        const offset = (page - 1) * limit
        const { where, orderBy } = this.resolveConditions(conditions)
        const query = this.baseProductQuery().where(where).limit(limit).offset(offset)
        const rows = await (orderBy ? query.orderBy(orderBy) : query)
        const locs = await this.fetchProductLocalizations(rows)
        return rows.map((row) => this.mapRow(row, locs))
    }

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

    private baseProductQuery() {
        return this.db
            .select({
                ...getTableColumns(schema.products),
                vendor: getTableColumns(schema.vendors),
                category: getTableColumns(schema.productCategories),
                brand: getTableColumns(schema.dBrands),
                country: getTableColumns(schema.dCountries),
            })
            .from(schema.products)
            .leftJoin(schema.vendors, eq(schema.products.vendorOwnerId, schema.vendors.vid))
            .leftJoin(
                schema.productCategories,
                eq(schema.productCategories.pcid, schema.products.pcid),
            )
            .leftJoin(schema.dBrands, eq(schema.dBrands.id, schema.products.brandId))
            .leftJoin(schema.dCountries, eq(schema.dCountries.id, schema.products.countryId))
    }

    private async fetchProductLocalizations(rows: Product[]) {
        const categoryIds = [
            ...new Set(rows.map((r) => r.category?.pcid).filter(Boolean)),
        ] as number[]
        const brandIds = [...new Set(rows.map((r) => r.brand?.id).filter(Boolean))] as number[]
        const countryIds = [...new Set(rows.map((r) => r.country?.id).filter(Boolean))] as number[]
        const productIds = [...new Set(rows.map((r) => r.pid))] as number[]

        const [categoryLocs, brandLocs, countryLocs, productMedia] = await Promise.all([
            categoryIds.length
                ? this.db
                      .select()
                      .from(schema.productCategoryLocalizations)
                      .where(inArray(schema.productCategoryLocalizations.pcid, categoryIds))
                : [],
            brandIds.length
                ? this.db
                      .select()
                      .from(schema.dBrandValuesLocalizations)
                      .where(inArray(schema.dBrandValuesLocalizations.id, brandIds))
                : [],
            countryIds.length
                ? this.db
                      .select()
                      .from(schema.dCountryValuesLocalizations)
                      .where(inArray(schema.dCountryValuesLocalizations.id, countryIds))
                : [],
            productIds.length
                ? this.db
                      .select({
                          ...getTableColumns(schema.productMedia),
                          media: getTableColumns(schema.media),
                      })
                      .from(schema.productMedia)
                      .innerJoin(schema.media, eq(schema.media.mid, schema.productMedia.mediaId))
                      .where(inArray(schema.productMedia.pid, productIds))
                : [],
        ])

        return {
            categoryLocMap: Map.groupBy(categoryLocs, (l) => l.pcid),
            brandLocMap: Map.groupBy(brandLocs, (l) => l.id),
            countryLocMap: Map.groupBy(countryLocs, (l) => l.id),
            productMedia,
        }
    }

    private mapRow(
        row: Awaited<ReturnType<typeof this.baseProductQuery>>[number],
        locMaps: Awaited<ReturnType<typeof this.fetchProductLocalizations>>,
    ): Product {
        const { category, vendor, brand, country, ...product } = row
        const { categoryLocMap, brandLocMap, countryLocMap, productMedia } = locMaps
        return {
            ...product,
            vendor,
            category: category?.pcid
                ? {
                      ...category,
                      localizations: categoryLocMap.get(category.pcid) ?? [],
                  }
                : null,
            brand: brand?.id ? { ...brand, localizations: brandLocMap.get(brand.id) ?? [] } : null,
            country: country?.id
                ? {
                      ...country,
                      localizations: countryLocMap.get(country.id) ?? [],
                  }
                : null,
            productMedia,
        }
    }

    async fetchProduct(conditions: SQL[]): Promise<Product> {
        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined
        const rows = await this.baseProductQuery().where(whereCondition).limit(1)
        const locs = await this.fetchProductLocalizations(rows)
        const productReviews = await this.db
            .select({
                ...getTableColumns(schema.productReviews),
                client: getTableColumns(schema.clients),
            })
            .from(schema.productReviews)
            .leftJoin(schema.clients, eq(schema.productReviews.cid, schema.clients.cid))
            .where(eq(schema.productReviews.pid, rows[0].pid))
            .limit(20)

        const product = this.mapRow(rows[0], locs)

        return {
            ...product,
            reviews: productReviews,
        }
    }

    async fetchProducts(conditions: SQL[], pagination: PaginationOptions): Promise<Product[]> {
        const { page, limit } = pagination
        const offset = (page - 1) * limit
        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined
        const rows = await this.baseProductQuery().where(whereCondition).offset(offset).limit(limit)
        const locs = await this.fetchProductLocalizations(rows)
        return rows.map((row) => this.mapRow(row, locs))
    }
}
