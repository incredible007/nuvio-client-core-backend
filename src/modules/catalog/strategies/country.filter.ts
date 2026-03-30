import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface';
import { ProductFilters } from '@/modules/catalog/dto/filters';
import { inArray, SQL } from 'drizzle-orm';
import * as schema from '@/database/schema';

export class CountryFilter implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH];
    apply(filters: ProductFilters): SQL | undefined {
        if (!filters.countries?.length) return undefined;
        return inArray(schema.products.countryId, filters.countries);
    }
}
