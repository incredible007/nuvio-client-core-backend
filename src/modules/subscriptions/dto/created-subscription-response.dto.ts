import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator'
import { Expose } from 'class-transformer'

export class CreatedSubscriptionResponseDto {
    @ApiProperty({ description: 'ID созданной подписки в Stripe' })
    @Expose()
    @IsUUID()
    stripeSubscriptionId: string

    @ApiProperty({ description: 'ID клиента в Stripe' })
    @Expose()
    @IsUUID()
    stripeCustomerId: string

    @ApiProperty({ description: 'Дата окончания текущего периода оплаты' })
    @Expose()
    @IsDate()
    currentPeriodEnd?: Date

    @ApiProperty({
        enum: [
            'active',
            'incomplete',
            'incomplete_expired',
            'trialing',
            'past_due',
            'canceled',
            'unpaid',
        ],
        description: 'Начальный статус подписки (часто incomplete при charge)',
    })
    @Expose()
    @IsString()
    stripeStatus: string

    @ApiProperty({ description: 'ID последнего инвойса (для чека)' })
    @Expose()
    @IsOptional()
    @IsUUID()
    latestInvoiceId?: string

    @ApiProperty({ description: 'PaymentIntent для подтверждения (если неуспешно)' })
    @Expose()
    @IsOptional()
    @IsUUID()
    paymentIntentId?: string

    // Edge-case
    @ApiProperty({ description: 'client_secret для SetupIntent (если нет PM)' })
    @Expose()
    @IsOptional()
    clientSecret?: string // Only without PM case

    @ApiProperty({
        description: 'Тип: "ready" (есть PM, charge async), "setup_required" (нужен PM)',
        enum: ['ready', 'setup_required'],
    })
    @Expose()
    @IsString()
    type: 'ready' | 'setup_required'

    @ApiProperty({ description: 'URL успеха/redirect (опционально)' })
    @Expose()
    @IsOptional()
    redirectUrl?: string
}
