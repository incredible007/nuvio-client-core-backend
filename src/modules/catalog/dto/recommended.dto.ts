import { IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class RecommendedProductsDto {
    @IsInt()
    @Type(() => Number)
    pid: number
}
