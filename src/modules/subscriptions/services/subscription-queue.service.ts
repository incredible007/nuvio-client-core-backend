import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { SUBSCRIPTION_QUEUE, SubscriptionStatus } from '../enums/subscription-status.enum'
import {
    CancelJobData,
    PauseJobData,
    ReminderJobData,
    RetryPaymentJobData,
} from '../interfaces/subscription-queue.types'

@Injectable()
export class SubscriptionQueueService {
    private readonly logger = new Logger(SubscriptionQueueService.name)

    constructor(
        @InjectQueue(SUBSCRIPTION_QUEUE)
        private readonly queue: Queue,
    ) {}

    /**
     * Планирует напоминание пользователю перед следующим списанием.
     */
    async scheduleReminder(data: ReminderJobData): Promise<void> {
        const delay = this.msUntil(data.notifyAt)

        await this.queue.add(SubscriptionStatus.REMINDER, data, {
            delay,
            jobId: `reminder:${data.subscriptionId}`,
            removeOnComplete: true,
            removeOnFail: 3,
        })

        this.logger.debug(
            `Reminder scheduled for subscription ${data.subscriptionId} in ${delay}ms`,
        )
    }

    /**
     * Ставит задачу повторной попытки оплаты с экспоненциальным backoff [[1]](https://docs.bullmq.io/guide/retrying-failing-jobs).
     */
    async scheduleRetry(data: RetryPaymentJobData): Promise<void> {
        await this.queue.add(SubscriptionStatus.RETRY_PAYMENT, data, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 60_000, // 1 мин → 2 мин → 4 мин → 8 мин → 16 мин
            },
            jobId: `retry:${data.subscriptionId}:${data.attemptNumber}`,
            removeOnComplete: true,
            removeOnFail: 10,
        })

        this.logger.debug(`Retry payment scheduled for subscription ${data.subscriptionId}`)
    }

    /**
     * Планирует отмену подписки в конце расчётного периода.
     */
    async scheduleCancellation(data: CancelJobData): Promise<void> {
        const delay = this.msUntil(data.cancelAt)

        await this.queue.add(SubscriptionStatus.CANCEL, data, {
            delay,
            jobId: `cancel:${data.subscriptionId}`,
            removeOnComplete: true,
            removeOnFail: 3,
        })

        this.logger.debug(
            `Cancellation scheduled for subscription ${data.subscriptionId} in ${delay}ms`,
        )
    }

    /**
     * Планирует паузу подписки.
     */
    async schedulePause(data: PauseJobData): Promise<void> {
        const delay = data.pauseUntil ? this.msUntil(data.pauseUntil) : 0

        await this.queue.add(SubscriptionStatus.PAUSE, data, {
            delay,
            jobId: `pause:${data.subscriptionId}`,
            removeOnComplete: true,
            removeOnFail: 3,
        })

        this.logger.debug(`Pause scheduled for subscription ${data.subscriptionId}`)
    }

    /**
     * Удаляет запланированный джоб (например, при досрочной отмене).
     */
    async removeJob(jobId: string): Promise<void> {
        const job = await this.queue.getJob(jobId)
        if (job) {
            await job.remove()
            this.logger.debug(`Job ${jobId} removed from queue`)
        }
    }

    private msUntil(date: Date): number {
        return Math.max(0, new Date(date).getTime() - Date.now())
    }
}
