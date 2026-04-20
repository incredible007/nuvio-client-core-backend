import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { CreateSubscriptionParams, PaymentProvider } from '../interfaces/payment-provider.interface'
import { CreatedSubscriptionResponseDto } from '@/modules/subscriptions/dto/created-subscription-response.dto'
import {
    SUBSCRIPTIONS_REPOSITORY,
    SubscriptionsRepositoryI,
} from '@/modules/subscriptions/interfaces/subscriptions-repository.interface'

@Injectable()
export class BillingService implements PaymentProvider {
    private readonly stripe: Stripe
    private readonly logger = new Logger(BillingService.name)

    constructor(
        private readonly config: ConfigService,
        @Inject(SUBSCRIPTIONS_REPOSITORY)
        private readonly subscriptionsRepo: SubscriptionsRepositoryI,
    ) {
        this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY') ?? '', {
            apiVersion: '2025-02-24.acacia',
        })
    }

    async ensureStripeCustomerID(cid: number, email: string, name?: string): Promise<string> {
        const client = await this.subscriptionsRepo.fetchClient(cid)

        if (client?.stripeCustomerId) {
            return client.stripeCustomerId
        }

        const customer = await this.stripe.customers.create({ email, name })
        await this.subscriptionsRepo.updateClient(cid, { stripeCustomerId: customer.id })
        return customer.id
    }

    async createSubscription(
        params: CreateSubscriptionParams,
    ): Promise<CreatedSubscriptionResponseDto> {
        const { stripeCustomerId, stripePriceId, paymentMethodId, metadata } = params

        try {
            if (paymentMethodId) {
                await this.stripe.paymentMethods.attach(paymentMethodId, {
                    customer: stripeCustomerId,
                })
                await this.stripe.customers.update(stripeCustomerId, {
                    invoice_settings: { default_payment_method: paymentMethodId },
                })
            }

            const subscription = await this.stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [{ price: stripePriceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
                metadata: metadata ?? {},
            })

            const invoice = subscription.latest_invoice as Stripe.Invoice
            const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

            return {
                stripeSubscriptionId: subscription.id,
                stripeStatus: subscription.status,
                stripeCustomerId,
                type: !!paymentMethodId ? 'ready' : 'setup_required',
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                clientSecret: paymentIntent?.client_secret ?? undefined,
            }
        } catch (error) {
            this.logger.error('Stripe createSubscription failed', error)
            throw new InternalServerErrorException('Ошибка создания подписки в Stripe')
        }
    }
}
