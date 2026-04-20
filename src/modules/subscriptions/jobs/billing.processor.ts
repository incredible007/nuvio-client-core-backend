import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SUBSCRIPTION_QUEUE, SubscriptionStatus } from '../enums/subscription-status.enum'
import { CancelJobData, PauseJobData } from '../interfaces/subscription-queue.types'
import { BillingService } from '../services/billing.service'
import { AuditLogService } from '../services/audit-log.service'
import {
    SUBSCRIPTIONS_REPOSITORY,
    SubscriptionsRepositoryI,
} from '@/modules/subscriptions/interfaces/subscriptions-repository.interface'

@Processor(SUBSCRIPTION_QUEUE)
export class BillingProcessor extends WorkerHost {
    private readonly logger = new Logger(BillingProcessor.name)

    constructor(
        private readonly billing: BillingService,
        @Inject(SUBSCRIPTIONS_REPOSITORY)
        private readonly subscriptionsRepo: SubscriptionsRepositoryI,
        private readonly auditLog: AuditLogService,
    ) {
        super()
    }

    async process(job: Job): Promise<void> {
        switch (job.name) {
            case SubscriptionStatus.CANCEL:
                return this.handleCancel(job as Job<CancelJobData>)
            case SubscriptionStatus.PAUSE:
                return this.handlePause(job as Job<PauseJobData>)
        }
    }

    private async handleCancel(job: Job<CancelJobData>): Promise<void> {
        // const { subscriptionId, clientId } = job.data
        //
        // this.logger.log(`Cancelling subscription ${subscriptionId}`)
        //
        // await this.billing.cancelSubscription(subscriptionId)
        // await this.subscriptionsRepo.updateStatus(subscriptionId, SubscriptionStatus.CANCEL)
        // await this.auditLog.log({
        //     action: 'SUBSCRIPTION_CANCELLED',
        //     actorId: clientId,
        //     actorType: 'client',
        //     resourceId: subscriptionId,
        //     meta: {},
        // })
        //
        // this.logger.log(`Subscription ${subscriptionId} cancelled`)
    }

    private async handlePause(job: Job<PauseJobData>): Promise<void> {
        // const { subscriptionId, clientId } = job.data
        //
        // this.logger.log(`Pausing subscription ${subscriptionId}`)
        //
        // await this.billing.pauseSubscription(subscriptionId)
        // await this.subscriptionsRepo.updateStatus(subscriptionId, SubscriptionStatus.PAUSE)
        // await this.auditLog.log({
        //     action: 'SUBSCRIPTION_PAUSED',
        //     actorId: clientId,
        //     actorType: 'client',
        //     resourceId: subscriptionId,
        //     meta: {},
        // })
        //
        // this.logger.log(`Subscription ${subscriptionId} paused`)
    }
}
