import { Injectable } from '@nestjs/common';
import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface';
import { ProductFilters } from '@/modules/catalog/dto/filters';
import { inArray, SQL } from 'drizzle-orm';
import * as schema from '@/database/schema';

@Injectable()
export class BrandFilterStrategy implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH];
    apply(filters: ProductFilters): SQL | undefined {
        if (!filters.brands?.length) return undefined;
        return inArray(schema.products.brandId, filters.brands);
    }
}
