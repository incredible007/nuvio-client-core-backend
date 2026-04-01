import { Controller, Get, Query } from '@nestjs/common'
import { CatalogService } from '../services/catalog.service'
import type { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { RecommendedProductsDto } from '@/modules/catalog/dto/recommended.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get('fetch_products')
    @ApiOperation({
        summary: 'Получить товары по фильтрам',
        description:
            'Возвращает постраничный список товаров с применением фильтров',
    })
    async getProductsByFilters(
        @Query() filters: ProductFiltersDto,
        @Query() paginationOptions: PaginationOptions,
    ) {
        return this.catalogService.getProductsByFilters(
            filters,
            paginationOptions,
        )
    }

    @Get('fetch_recommended_products')
    @ApiOperation({
        summary: 'Получить рекомендованные товары',
        description:
            'Возвращает постраничный список рекомендованных товаров для выбранного товара',
    })
    async fetchRecommendedProducts(
        @Query() dto: RecommendedProductsDto,
        @Query() paginationOptions: PaginationOptions,
    ) {
        return this.catalogService.fetchRecommendedProducts(
            dto,
            paginationOptions,
        )
    }

    @Get('fetch_product')
    @ApiOperation({
        summary: 'Получить модель продукта',
        description: 'Возвращает модель продукта по pid с массивом отзывов',
    })
    async fetchProduct(@Query() pid: number) {
        return this.catalogService.fetchProduct(pid)
    }
}
