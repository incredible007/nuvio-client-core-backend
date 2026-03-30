import {
    FilterScope,
    FilterStrategy,
} from '@/modules/catalog/interfaces/filter-strategy.interface';
import { ProductFilters } from '@/modules/catalog/dto/filters';
import { like, SQL } from 'drizzle-orm';
import { products } from '@/database/schema';

export class NameFilter implements FilterStrategy {
    readonly scopes = [FilterScope.PRODUCTS_LIST, FilterScope.PRODUCT_SEARCH];
    apply(filters: ProductFilters): SQL | undefined {
        if (!filters.name) return undefined;
        return like(products.productSlug, `%${filters.name}%`);
    }
}
