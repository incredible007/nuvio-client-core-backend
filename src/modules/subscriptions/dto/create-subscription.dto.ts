import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSubscriptionDto {
    @ApiProperty({ description: 'ID тарифного плана (product_prices)' })
    @IsString()
    @IsNotEmpty()
    stripePriceId: string

    @ApiProperty({ description: 'Stripe PaymentMethod ID клиента' })
    @IsOptional()
    cpmid?: number
}
