import { Module } from '@nestjs/common'
import { SubscriptionsService } from '@/modules/subscriptions/services/subscriptions.service'
import { SubscriptionsController } from '@/modules/subscriptions/controllers/subscriptions.controller'
import { IdempotencyService } from '@/modules/subscriptions/services/idempotency.service'
import { NotificationService } from '@/modules/subscriptions/services/notification.service'
import { BillingService } from '@/modules/subscriptions/services/billing.service'
import { AuditLogService } from '@/modules/subscriptions/services/audit-log.service'
import { BullModule } from '@nestjs/bullmq'
import { SUBSCRIPTION_QUEUE } from '@/modules/subscriptions/enums/subscription-status.enum'

@Module({
    controllers: [SubscriptionsController],
    imports: [
        BullModule.registerQueue({
            name: SUBSCRIPTION_QUEUE,
        }),
    ],
    providers: [
        SubscriptionsService,
        IdempotencyService,
        NotificationService,
        BillingService,
        AuditLogService,
    ],
})
export class SubscriptionsModule {}
