import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { SUBSCRIPTION_QUEUE, SubscriptionStatus } from '../enums/subscription-status.enum'
import { RetryPaymentJobData } from '../interfaces/subscription-queue.types'
import { BillingService } from '../services/billing.service'
import {
    SUBSCRIPTIONS_REPOSITORY,
    SubscriptionsRepositoryI,
} from '@/modules/subscriptions/interfaces/subscriptions-repository.interface'

@Processor(SUBSCRIPTION_QUEUE)
export class RetryProcessor extends WorkerHost {
    private readonly logger = new Logger(RetryProcessor.name)

    constructor(
        private readonly billing: BillingService,
        @Inject(SUBSCRIPTIONS_REPOSITORY)
        private readonly subscriptionsRepo: SubscriptionsRepositoryI,
    ) {
        super()
    }

    async process(job: Job): Promise<void> {
        switch (job.name) {
            case SubscriptionStatus.RETRY_PAYMENT:
                return this.handleRetry(job as Job<RetryPaymentJobData>)
        }
    }

    private async handleRetry(job: Job<RetryPaymentJobData>): Promise<void> {
        // const { subscriptionId, stripeSubscriptionId, attemptNumber } = job.data
        //
        // this.logger.log(`Retry attempt #${attemptNumber} for subscription ${subscriptionId}`)
        //
        // // Если все попытки исчерпаны — помечаем подписку как неактивную
        // if (job.attemptsMade >= (job.opts.attempts ?? 5)) {
        //     this.logger.warn(`All retries exhausted for subscription ${subscriptionId}`)
        //     await this.subscriptionsRepo.updateStatus(subscriptionId, SubscriptionStatus.INACTIVE)
        //     return
        // }
        //
        // // BullMQ сам повторит джоб с backoff если метод бросит ошибку
        // await this.billing.retryPayment(stripeSubscriptionId)
        //
        // this.logger.log(`Retry payment succeeded for subscription ${subscriptionId}`)
    }
}
