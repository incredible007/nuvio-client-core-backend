import { Module } from '@nestjs/common'
import { SubscriptionsService } from '@/modules/subscriptions/services/subscriptions.service'
import { SubscriptionsController } from '@/modules/subscriptions/controllers/subscriptions.controller'
import { IdempotencyService } from '@/modules/subscriptions/services/idempotency.service'
import { NotificationService } from '@/modules/subscriptions/services/notification.service'
import { BillingService } from '@/modules/subscriptions/services/billing.service'
import { AuditLogService } from '@/modules/subscriptions/services/audit-log.service'

@Module({
    controllers: [SubscriptionsController],
    providers: [
        SubscriptionsService,
        IdempotencyService,
        NotificationService,
        BillingService,
        AuditLogService,
    ],
})
export class SubscriptionsModule {}
