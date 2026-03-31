import * as schema from '@/database/schema'

export type Product = typeof schema.products.$inferSelect & {
    vendor?: typeof schema.vendors.$inferSelect
    category?: typeof schema.productCategories.$inferSelect & {
        localizations?: (typeof schema.productCategoryLocalizations.$inferSelect)[]
    }
    brand?: typeof schema.dBrands.$inferSelect & {
        localizations?: (typeof schema.dBrandValuesLocalizations.$inferSelect)[]
    }
    country?: typeof schema.dCountries.$inferSelect & {
        localizations?: (typeof schema.dCountryValuesLocalizations.$inferSelect)[]
    }
    productMedia?: (typeof schema.productMedia.$inferSelect & {
        media?: typeof schema.media.$inferSelect
    })[]
}
