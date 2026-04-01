import { Module } from '@nestjs/common'
import { CatalogService } from './services/catalog.service'
import { CatalogController } from './controllers/catalog.controller'
import { CatalogRepository } from '@/modules/catalog/catalog.repository'
import { CATALOG_REPOSITORY } from '@/modules/catalog/interfaces/catalog-repository.interface'
import { FILTER_STRATEGIES } from '@/modules/catalog/interfaces/filter-strategy.interface'
import {
    ArticleNumberFilter,
    BrandFilterStrategy,
    CategoryFilterStrategy,
    CountryFilterStrategy,
    NameFilterStrategy,
    PriceRangeFilterStrategy,
    ProductVariantFilter,
    VendorFilterStrategy,
} from '@/modules/catalog/strategies'
import { CatalogQueryService } from '@/modules/catalog/services/catalog-query.service'
import { CatalogFilterService } from '@/modules/catalog/services/catalog-filter.service'
import { CatalogCacheService } from '@/modules/catalog/services/catalog-cache.service'
import { ProductSearchStrategy } from '@/modules/catalog/strategies/product-search.strategy'

@Module({
    controllers: [CatalogController],
    providers: [
        CatalogService,
        CatalogQueryService,
        CatalogFilterService,
        CatalogCacheService,

        // strategies
        CategoryFilterStrategy,
        PriceRangeFilterStrategy,
        BrandFilterStrategy,
        CountryFilterStrategy,
        VendorFilterStrategy,
        ProductVariantFilter,
        NameFilterStrategy,
        ArticleNumberFilter,
        ProductSearchStrategy,

        {
            provide: CATALOG_REPOSITORY,
            useClass: CatalogRepository,
        },
        {
            provide: FILTER_STRATEGIES,
            useFactory: (
                category: CategoryFilterStrategy,
                priceRange: PriceRangeFilterStrategy,
                brand: BrandFilterStrategy,
                country: CountryFilterStrategy,
                vendor: VendorFilterStrategy,
                productVariant: ProductVariantFilter,
                name: NameFilterStrategy,
                articleNumber: ArticleNumberFilter,
                productSearch: ProductSearchStrategy,
            ) => [
                category,
                priceRange,
                brand,
                country,
                vendor,
                productVariant,
                name,
                articleNumber,
                productSearch,
            ],
            inject: [
                CategoryFilterStrategy,
                PriceRangeFilterStrategy,
                BrandFilterStrategy,
                CountryFilterStrategy,
                VendorFilterStrategy,
                ProductVariantFilter,
                NameFilterStrategy,
                ArticleNumberFilter,
                ProductSearchStrategy,
            ],
        },
    ],
})
export class CatalogModule {}
