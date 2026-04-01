import { Injectable } from '@nestjs/common'
import { CatalogQueryService } from './catalog-query.service'
import { ProductFilters } from '@/modules/catalog/dto/product-filters'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { RecommendedProductsFilters } from '@/modules/catalog/dto/recommended-filters'

@Injectable()
export class CatalogService {
    constructor(private readonly queryService: CatalogQueryService) {}

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ) {
        return this.queryService.getProductsByFilters(filters, pagination)
    }

    async fetchRecommendedProducts(
        dto: RecommendedProductsFilters,
        pagination: PaginationOptions,
    ) {
        return this.queryService.fetchRecommendedProducts(dto, pagination)
    }

    async fetchProduct(pid: number) {
        return this.queryService.fetchProduct(pid)
    }
}
