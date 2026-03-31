import { Injectable } from '@nestjs/common'
import { CatalogQueryService } from './catalog-query.service'
import { ProductFilters } from '@/modules/catalog/dto/filters'
import { PaginationOptions } from '@/common/dto/pagination-options.dto'

@Injectable()
export class CatalogService {
    constructor(private readonly queryService: CatalogQueryService) {}

    async getProductsByFilters(
        filters: ProductFilters,
        pagination: PaginationOptions,
    ) {
        return this.queryService.getProductsByFilters(filters, pagination)
    }
}
