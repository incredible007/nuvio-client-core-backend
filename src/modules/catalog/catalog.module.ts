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
    CountryFilter,
    NameFilter,
    PriceRangeFilterStrategy,
    ProductVariantFilter,
    VendorFilter,
} from '@/modules/catalog/strategies'
import { CatalogQueryService } from '@/modules/catalog/services/catalog-query.service'
import { CatalogFilterService } from '@/modules/catalog/services/catalog-filter.service'
import { CatalogCacheService } from '@/modules/catalog/services/catalog-cache.service'

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
        CountryFilter,
        VendorFilter,
        ProductVariantFilter,
        NameFilter,
        ArticleNumberFilter,

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
                country: CountryFilter,
                vendor: VendorFilter,
                productVariant: ProductVariantFilter,
                name: NameFilter,
                articleNumber: ArticleNumberFilter,
            ) => [
                category,
                priceRange,
                brand,
                country,
                vendor,
                productVariant,
                name,
                articleNumber,
            ],
            inject: [
                CategoryFilterStrategy,
                PriceRangeFilterStrategy,
                BrandFilterStrategy,
                CountryFilter,
                VendorFilter,
                ProductVariantFilter,
                NameFilter,
                ArticleNumberFilter,
            ],
        },
    ],
})
export class CatalogModule {}
