import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { BillingService } from '@/modules/subscriptions/services/billing.service'
import { IdempotencyService } from '@/modules/subscriptions/services/idempotency.service'
import { AuditLogService } from '@/modules/subscriptions/services/audit-log.service'
import { NotificationService } from '@/modules/subscriptions/services/notification.service'
import { SubscriptionQueueService } from '@/modules/subscriptions/services/subscription-queue.service'
import { CreateSubscriptionDto } from '@/modules/subscriptions/dto/create-subscription.dto'
import {
    SUBSCRIPTIONS_REPOSITORY,
    SubscriptionsRepositoryI,
} from '@/modules/subscriptions/interfaces/subscriptions-repository.interface'
import { CreatedSubscriptionResponseDto } from '@/modules/subscriptions/dto/created-subscription-response.dto'

@Injectable()
export class SubscriptionsService {
    private readonly logger = new Logger(SubscriptionsService.name)

    constructor(
        private readonly billing: BillingService,
        private readonly idempotency: IdempotencyService,
        private readonly auditLog: AuditLogService,
        private readonly notification: NotificationService,
        private readonly queue: SubscriptionQueueService,
        @Inject(SUBSCRIPTIONS_REPOSITORY)
        private readonly subscriptionsRepo: SubscriptionsRepositoryI,
    ) {}

    async createSubscription(
        cid: number,
        dto: CreateSubscriptionDto,
        idempotencyKey: string,
    ): Promise<CreatedSubscriptionResponseDto> {
        const { isNew, result } = await this.idempotency.getOrCreate(
            idempotencyKey,
            'subscriptions',
        )
        if (!isNew) {
            return result as CreatedSubscriptionResponseDto
        }

        try {
            const price = await this.subscriptionsRepo.fetchSubscriptionPrice(dto.stripePriceId)

            const client = await this.subscriptionsRepo.fetchClient(cid)
            const selectedPaymentMethod = client.paymentMethods?.find(
                (pm) => pm.cpmid === dto.cpmid,
            )

            const stripeCustomerId = await this.billing.ensureStripeCustomerID(
                cid,
                client.email,
                client.name ?? undefined,
            )

            const { psid, stripeSubscriptionId } = await this.subscriptionsRepo.createSubscription({
                cid,
                pid: price.pid,
                stripeSubscriptionId: price.stripePriceId,
                productPrice: price.ppid,
            })

            let stripeResult: Awaited<ReturnType<BillingService['createSubscription']>>
            try {
                stripeResult = await this.billing.createSubscription({
                    stripeCustomerId: stripeCustomerId,
                    stripePriceId: price.stripePriceId,
                    paymentMethodId: selectedPaymentMethod?.stripePmId,
                    metadata: {
                        stripeSubscriptionId: stripeSubscriptionId ?? '',
                        cid: client.cid.toString(),
                        productId: price.stripeProductId,
                    },
                })
            } catch (error) {
                await this.subscriptionsRepo.updateSubscription(psid, {
                    productSubscriberState: 'AWAITING',
                })
                throw error
            }

            await Promise.all([
                this.subscriptionsRepo.updateSubscription(psid, {
                    nextPaymentAt: stripeResult.currentPeriodEnd,
                }),

                this.auditLog.log({
                    action: 'SUBSCRIPTION_CREATED',
                    actorId: cid,
                    actorType: 'client',
                    resourceId: stripeSubscriptionId ?? '',
                    meta: { stripeSubscriptionId: stripeResult.stripeSubscriptionId },
                }),

                // this.queue.scheduleReminder({
                //     subscriptionId,
                //     clientId,
                //     notifyAt: stripeResult.currentPeriodEnd,
                // }),
                //
                // this.notification.sendSubscriptionCreated(clientId, {
                //     subscriptionId,
                //     nextPaymentAt: stripeResult.currentPeriodEnd,
                // }),
            ])

            this.logger.log(`Subscription ${stripeSubscriptionId} created for client ${cid}`)

            return {
                stripeSubscriptionId: stripeResult.stripeSubscriptionId,
                stripeStatus: stripeResult.stripeStatus,
                stripeCustomerId,
                type: !!dto.cpmid ? 'ready' : 'setup_required',
                currentPeriodEnd: stripeResult.currentPeriodEnd,
                clientSecret: stripeResult.clientSecret,
            }
        } catch (error) {
            await this.idempotency.complete(idempotencyKey, 'subscriptions', 'failed', {
                error: error.message,
            })
            throw error
        }
    }

    async activateSubscription(stripeSubscriptionId: string) {
        const subscription = await this.subscriptionsRepo.fetchSubscription(stripeSubscriptionId)

        if (!subscription) {
            throw new NotFoundException(`Subscription not found: ${stripeSubscriptionId}`)
        }

        await this.subscriptionsRepo.updateSubscription(stripeSubscriptionId, {
            productSubscriberState: 'ACTIVE',
        })
        // await this.notification.sendSubscriptionActivated(subscription.clientId)

        this.logger.log(`Subscription ${subscription.psid} activated`)
    }

    async cancelSubscription(stripeSubscriptionId: string) {
        const subscription = await this.subscriptionsRepo.fetchSubscription(stripeSubscriptionId)

        if (!subscription) {
            throw new NotFoundException(`Subscription not found: ${stripeSubscriptionId}`)
        }

        await this.subscriptionsRepo.updateSubscription(stripeSubscriptionId, {
            productSubscriberState: 'CANCELLED',
        })
        // await this.notification.sendSubscriptionActivated(subscription.clientId)

        this.logger.log(`Subscription ${subscription.psid} cancelled`)
    }
}
