import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { CreateSubscriptionDto } from '@/modules/subscriptions/dto/create-subscription.dto'
import { SubscriptionsService } from '@/modules/subscriptions/services/subscriptions.service'
import { CreatedSubscriptionResponseDto } from '@/modules/subscriptions/dto/created-subscription-response.dto'
import { IdempotencyGuard } from '@/modules/subscriptions/guards/idempotency.guard'
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator'

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Post('create_subscription')
    @UseGuards(IdempotencyGuard)
    createSubscription(
        @Body() dto: CreateSubscriptionDto,
        @CurrentUser() user: JwtPayload,
        @Req()
        req: Request,
    ): Promise<CreatedSubscriptionResponseDto> {
        return this.subscriptionsService.createSubscription(user.cid, dto, req['idempotencyKey'])
    }
}
