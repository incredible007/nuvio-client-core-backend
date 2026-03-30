export interface ProductFilters {
    categories?: number[];
    priceRange?: { min: number; max: number };
    brands?: number[];
    countries?: number[];
    vendors?: number[];
    productVariant?: 'GOOD' | 'SUBSCRIPTION';
    name?: string;
    articleNumber?: string;
}

export interface PaginationOptions {
    page: number;
    limit: number;
}
