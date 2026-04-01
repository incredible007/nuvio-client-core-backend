import * as schema from '@/database/schema'

export type Product = typeof schema.products.$inferSelect & {
    vendor?: typeof schema.vendors.$inferSelect | null
    category?:
        | (typeof schema.productCategories.$inferSelect & {
              localizations?: (typeof schema.productCategoryLocalizations.$inferSelect)[]
          })
        | null
    brand?:
        | (typeof schema.dBrands.$inferSelect & {
              localizations?: (typeof schema.dBrandValuesLocalizations.$inferSelect)[]
          })
        | null
    country?:
        | (typeof schema.dCountries.$inferSelect & {
              localizations?: (typeof schema.dCountryValuesLocalizations.$inferSelect)[]
          })
        | null
    productMedia?: (typeof schema.productMedia.$inferSelect & {
        media?: typeof schema.media.$inferSelect
    })[]
    reviews?: (typeof schema.productReviews.$inferSelect & {
        client?: typeof schema.clients.$inferSelect | null
    })[]
}
