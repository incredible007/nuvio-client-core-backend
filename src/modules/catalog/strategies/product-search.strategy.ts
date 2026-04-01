import { Injectable } from '@nestjs/common'
import { eq, SQL, sql } from 'drizzle-orm'
import {
    FilterResult,
    FilterScope,
    FilterStrategy,
} from '../interfaces/filter-strategy.interface'
import * as schema from '@/database/schema'

interface SearchDto {
    query: string
}

function detectLanguage(q: string): string {
    if (/[\u4e00-\u9fff]/.test(q)) return 'simple' // CH
    if (/[а-яёА-ЯЁ]/.test(q)) return 'russian' // RU
    return 'english' // default
}

@Injectable()
export class ProductSearchStrategy implements FilterStrategy<SearchDto> {
    scopes = [FilterScope.PRODUCT_SEARCH]

    apply({ query }: SearchDto): SQL | FilterResult | undefined {
        if (!query) return undefined

        const q = query.trim()

        // if article_num
        if (/^[A-Z]{2,}-\d+$/i.test(q)) {
            return eq(schema.products.articleNumber, q.toUpperCase())
        }

        // if product-slug
        if (/^[a-z0-9-]+$/.test(q) && q.includes('-')) {
            return eq(schema.products.productSlug, q)
        }

        const lang = detectLanguage(q)

        const tsvector = sql`(
            setweight(to_tsvector(${lang}, coalesce(${schema.productLocalizations.name}, '')), 'A') ||
            setweight(to_tsvector(${lang}, coalesce(${schema.productLocalizations.description}, '')), 'B')
        )`

        const tsquery = sql`plainto_tsquery(${lang}, ${q})`

        return {
            where: sql`${tsvector} @@ ${tsquery}`,
            orderBy: sql`ts_rank(${tsvector}, ${tsquery}) DESC`,
        }
    }
}
