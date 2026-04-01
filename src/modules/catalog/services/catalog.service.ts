import { Injectable } from '@nestjs/common'
import { CatalogQueryService } from './catalog-query.service'
import { ProductFiltersDto } from '@/modules/catalog/dto/product-filters.dto'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'

@Injectable()
export class CatalogService {
    constructor(private readonly queryService: CatalogQueryService) {}

    async fetchProducts(
        filters: ProductFiltersDto,
        pagination: PaginationOptions,
    ) {
        return this.queryService.fetchProducts(filters, pagination)
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
