import { Injectable } from '@nestjs/common'
import { CatalogQueryService } from './catalog-query.service'

@Injectable()
export class CatalogService {
    constructor(private readonly queryService: CatalogQueryService) {}

    async getProductsByFilters(filters: any, pagination: any) {
        return this.queryService.getProductsByFilters(filters, pagination)
    }
}
