import { Injectable } from '@nestjs/common'
import { SubscriptionCache } from '@/modules/subscriptions/interfaces/subscription-cache.interface'
import { CachedSubscription } from '../dto/cached-subscription'

@Injectable()
export class SubscriptionCacheService implements SubscriptionCache {
    get(clientId: string): Promise<CachedSubscription | null> {
        throw new Error('Method not implemented.')
    }
    set(clientId: string, data: CachedSubscription, ttl: number): Promise<void> {
        throw new Error('Method not implemented.')
    }
    invalidate(clientId: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
