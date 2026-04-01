import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { SQL } from 'drizzle-orm'
import { Product } from '@/modules/catalog/interfaces/product.interface'

export interface ICatalogRepository {
    fetchProducts(
        conditions: SQL[],
        pagination: PaginationOptions,
    ): Promise<Product[]>
    fetchProduct(conditions: SQL[]): Promise<Product>
    searchProducts(
        conditions: SQL[],
        pagination: PaginationOptions,
    ): Promise<Product[]>
}

export const CATALOG_REPOSITORY = Symbol('ICatalogRepository')
