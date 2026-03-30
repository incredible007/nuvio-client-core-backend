import { ProductFilters } from '@/modules/catalog/dto/filters'
import { SQL } from 'drizzle-orm'

export enum FilterScope {
    PRODUCTS_LIST = 'PRODUCTS_LIST',
    PRODUCT_SEARCH = 'PRODUCT_SEARCH',
    SIMILAR_PRODUCTS = 'SIMILAR_PRODUCTS',
}

export interface FilterStrategy<T = ProductFilters> {
    scopes: FilterScope[]
    apply(filters: T): SQL | undefined
}

export const FILTER_STRATEGIES = Symbol('FILTER_STRATEGIES')
