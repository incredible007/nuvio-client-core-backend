import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { SQL } from 'drizzle-orm'

export enum FilterScope {
    PRODUCTS_LIST = 'PRODUCTS_LIST',
    PRODUCT_SEARCH = 'PRODUCT_SEARCH',
    RECOMMENDED_PRODUCTS = 'RECOMMENDED_PRODUCTS',
}

export interface FilterStrategy<T = ProductFiltersDto> {
    scopes: FilterScope[]
    apply(filters: T): SQL | undefined
}

export const FILTER_STRATEGIES = Symbol('FILTER_STRATEGIES')
