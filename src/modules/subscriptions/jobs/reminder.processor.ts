import { Processor, WorkerHost } from '@nestjs/bullmq'
import {
    SUBSCRIPTION_QUEUE,
    SubscriptionStatus,
} from '@/modules/subscriptions/enums/subscription-status.enum'
import { Job } from 'bullmq'
import { ReminderJobData } from '@/modules/subscriptions/interfaces/subscription-queue.types'
import { Logger } from '@nestjs/common'
import { NotificationService } from '@/modules/subscriptions/services/notification.service'

@Processor(SUBSCRIPTION_QUEUE)
export class ReminderProcessor extends WorkerHost {
    private readonly logger = new Logger(ReminderProcessor.name)

    constructor(private readonly notification: NotificationService) {
        super()
    }

    async process(job: Job): Promise<void> {
        switch (job.name) {
            case SubscriptionStatus.REMINDER:
                return this.handleReminder(job as Job<ReminderJobData>)
        }
    }

    private async handleReminder(job: Job<ReminderJobData>): Promise<void> {
        const { subscriptionId, clientId } = job.data

        this.logger.log(`Processing reminder for subscription ${subscriptionId}`)

        await this.notification.sendPaymentReminder(clientId, { subscriptionId })

        this.logger.log(`Reminder sent for subscription ${subscriptionId}`)
    }
}
