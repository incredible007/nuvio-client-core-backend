import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ProductFiltersDto {
    @IsOptional()
    @Type(() => Array)
    categories?: number[]

    @IsOptional()
    @Type(() => Object)
    priceRange?: { min: number; max: number }

    @IsOptional()
    @Type(() => Array)
    brands?: number[]

    @IsOptional()
    @Type(() => Array)
    countries?: number[]

    @IsOptional()
    @Type(() => Array)
    vendors?: number[]

    @IsOptional()
    @IsIn(['GOOD', 'SUBSCRIPTION'])
    productVariant?: 'GOOD' | 'SUBSCRIPTION'

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    articleNumber?: string
}
