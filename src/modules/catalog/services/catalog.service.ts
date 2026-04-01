import { Injectable } from '@nestjs/common'
import { CatalogQueryService } from './catalog-query.service'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { RecommendedProductsDto } from '@/modules/catalog/dto/recommended.dto'

@Injectable()
export class CatalogService {
    constructor(private readonly queryService: CatalogQueryService) {}

    async getProductsByFilters(
        filters: ProductFiltersDto,
        pagination: PaginationOptions,
    ) {
        return this.queryService.getProductsByFilters(filters, pagination)
    }

    async fetchRecommendedProducts(
        dto: RecommendedProductsDto,
        pagination: PaginationOptions,
    ) {
        return this.queryService.fetchRecommendedProducts(dto, pagination)
    }

    async fetchProduct(pid: number) {
        return this.queryService.fetchProduct(pid)
    }
}
