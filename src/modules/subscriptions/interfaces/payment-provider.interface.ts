import { CreatedSubscriptionResponseDto } from '@/modules/subscriptions/dto/created-subscription-response.dto'

export interface CreateSubscriptionParams {
    stripeCustomerId: string
    stripePriceId: string
    paymentMethodId?: string | null
    metadata?: Record<string, string>
}

export interface PaymentProvider {
    createSubscription(params: CreateSubscriptionParams): Promise<CreatedSubscriptionResponseDto>
    ensureStripeCustomerID(clientId: number, email: string, name?: string): Promise<string>
}
