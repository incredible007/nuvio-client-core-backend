import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface';
import { ProductFilters } from '@/modules/catalog/dto/filters';
import { inArray, SQL } from 'drizzle-orm';
import { products } from '@/database/schema';

export class VendorFilter implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH];
    apply(filters: ProductFilters): SQL | undefined {
        if (!filters.vendors?.length) return undefined;
        return inArray(products.vendorOwnerId, filters.vendors);
    }
}
