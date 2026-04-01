import { IsString, MaxLength, MinLength } from 'class-validator'
import { Type, Transform } from 'class-transformer'

export class SearchProductsDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @Transform(({ value }) => value?.trim())
    query: string
}
