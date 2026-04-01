import { Controller, Get, Query } from '@nestjs/common'
import { CatalogService } from '../services/catalog.service'
import type { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SearchProductsDto } from '@/modules/catalog/dto/search-products.dto'
import { Product } from '@/modules/catalog/interfaces/product.interface'
import { WishlistProductsDto } from '@/modules/catalog/dto/wishlist-products.dto'

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
    async fetchProducts(
        @Query() filters: ProductFiltersDto,
        @Query() paginationOptions: PaginationOptions,
    ) {
        return this.catalogService.fetchProducts(filters, paginationOptions)
    }

    @Get('fetch_recommended_products')
    @ApiOperation({
        summary: 'Получить рекомендованные товары',
        description:
            'Возвращает постраничный список рекомендованных товаров для выбранного товара',
    })
    async fetchRecommendedProducts(
        @Query() pid: number,
        @Query() paginationOptions: PaginationOptions,
        @Query() filters?: ProductFiltersDto,
    ) {
        return this.catalogService.fetchRecommendedProducts(
            pid,
            paginationOptions,
            filters,
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

    @Get('search_products')
    @ApiOperation({
        summary: 'Поиск по товарам',
        description: 'Возвращает массив моделей продукта',
    })
    async searchProducts(
        @Query() dto: SearchProductsDto,
        @Query() pagination: PaginationOptions,
        @Query() filters?: ProductFiltersDto,
    ): Promise<Product[]> {
        return this.catalogService.searchProducts(dto, pagination, filters)
    }

    @Get('fetch_wishlist_products')
    @ApiOperation({
        summary: 'Получение товары из списка желаемого',
        description:
            'Возвращает постраничный список товаров из списка желаемого с применением фильтров',
    })
    async fetchWishlistProducts(
        @Query() dto: WishlistProductsDto,
        @Query() pagination: PaginationOptions,
        @Query() filters?: ProductFiltersDto,
    ) {
        return this.catalogService.fetchWishlistProducts(
            dto,
            pagination,
            filters,
        )
    }
}
