import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { SQL } from 'drizzle-orm'

export enum FilterScope {
    PRODUCTS_LIST = 'PRODUCTS_LIST',
    PRODUCT_SEARCH = 'PRODUCT_SEARCH',
}

export interface FilterResult {
    where?: SQL
    orderBy?: SQL
}

export interface FilterStrategy<T = ProductFiltersDto> {
    scopes: FilterScope[]
    apply(dto: T): SQL | FilterResult | undefined
}

export const FILTER_STRATEGIES = Symbol('FILTER_STRATEGIES')
