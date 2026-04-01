import { IsNumber, Min } from 'class-validator'

export class WishlistProductsDto {
    @IsNumber()
    @Min(1)
    cid: number
}
