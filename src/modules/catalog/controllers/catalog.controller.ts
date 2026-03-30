import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from '../catalog.service';
import type {
    ProductFilters,
    PaginationOptions,
} from '@/common/contracts/filters';

@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get('products')
    async getProducts(
        @Query() filters: ProductFilters,
        @Query() paginationOptions: PaginationOptions,
    ) {
        return this.catalogService.getProductsByFilters(
            filters,
            paginationOptions,
        );
    }
}
