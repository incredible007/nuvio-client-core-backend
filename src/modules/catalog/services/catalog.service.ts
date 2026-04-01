import { Injectable } from '@nestjs/common'
import { CatalogQueryService } from './catalog-query.service'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { SearchProductsDto } from '@/modules/catalog/dto/search-products.dto'
import { Product } from '@/modules/catalog/interfaces/product.interface'
import { async } from 'rxjs'

@Injectable()
export class CatalogService {
    constructor(private readonly queryService: CatalogQueryService) {}

    async fetchProducts(
        filters: ProductFiltersDto,
        pagination: PaginationOptions,
    ) {
        return this.queryService.fetchProducts(filters, pagination)
    }

    async searchProducts(
        dto: SearchProductsDto,
        pagination: PaginationOptions,
        filters?: ProductFiltersDto,
    ): Promise<Product[]> {
        return this.queryService.searchProducts(dto, pagination, filters)
    }

    async fetchRecommendedProducts(
        pid: number,
        pagination: PaginationOptions,
        filters?: ProductFiltersDto,
    ) {
        return this.queryService.fetchRecommendedProducts(
            pid,
            pagination,
            filters,
        )
    }

    async fetchProduct(pid: number) {
        return this.queryService.fetchProduct(pid)
    }
}
