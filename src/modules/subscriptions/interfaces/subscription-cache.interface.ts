import { CachedSubscription } from '@/modules/subscriptions/dto/cached-subscription'

export interface SubscriptionCache {
    get(clientId: string): Promise<CachedSubscription | null>
    set(clientId: string, data: CachedSubscription, ttl: number): Promise<void>
    invalidate(clientId: string): Promise<void>
}

export const SUBSCRIPTION_CACHE = Symbol.for('SUBSCRIPTION_CACHE')
