import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './controllers/catalog.controller';
import { CatalogRepository } from '@/modules/catalog/catalog.repository';
import { CATALOG_REPOSITORY } from '@/modules/catalog/interfaces/catalog-repository.interface';
import { FILTER_STRATEGIES } from '@/modules/catalog/interfaces/filter-strategy.interface';
import { CategoryFilterStrategy } from '@/modules/catalog/strategies/category.filter';
import { PriceRangeFilterStrategy } from '@/modules/catalog/strategies/price-range.filter';
import { BrandFilterStrategy } from '@/modules/catalog/strategies/brand.filter';
import { CountryFilter } from '@/modules/catalog/strategies/country.filter';
import { VendorFilter } from '@/modules/catalog/strategies/vendor.filter';
import { ProductVariantFilter } from '@/modules/catalog/strategies/product-variant.filter';
import { NameFilter } from '@/modules/catalog/strategies/name.filter';
import { ArticleNumberFilter } from '@/modules/catalog/strategies/article-number.filter';

@Module({
    controllers: [CatalogController],
    providers: [
        CatalogService,
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
