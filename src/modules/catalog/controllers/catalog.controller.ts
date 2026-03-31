import { Controller, Get, Query } from '@nestjs/common'
import { CatalogService } from '../services/catalog.service'
import type { ProductFilters } from '@/modules/catalog/dto/product-filters'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { RecommendedProductsFilters } from '@/modules/catalog/dto/recommended-filters'

@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get('fetch_products')
    async getProductsByFilters(
        @Query() filters: ProductFilters,
        @Query() paginationOptions: PaginationOptions,
    ) {
        return this.catalogService.getProductsByFilters(
            filters,
            paginationOptions,
        )
    }

    @Get('fetch_recommended_products')
    async fetchRecommendedProducts(
        @Query() dto: RecommendedProductsFilters,
        @Query() paginationOptions: PaginationOptions,
    ) {
        return this.catalogService.fetchRecommendedProducts(
            dto,
            paginationOptions,
        )
    }
}
