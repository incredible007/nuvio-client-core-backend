import { IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class RecommendedProductsFilters {
    @IsInt()
    @Type(() => Number)
    pid: number
}
