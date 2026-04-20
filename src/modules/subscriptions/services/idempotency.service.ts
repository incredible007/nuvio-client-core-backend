import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import {
    SUBSCRIPTIONS_REPOSITORY,
    SubscriptionsRepositoryI,
} from '@/modules/subscriptions/interfaces/subscriptions-repository.interface'

export type IdempotencyStatus = 'pending' | 'completed' | 'failed'

const CACHE_TTL_MS = 3_600_000 // 1 hour
const KEY_TTL_MS = 86_400_000 // 24 hours

@Injectable()
export class IdempotencyService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
        @Inject(SUBSCRIPTIONS_REPOSITORY)
        private readonly subscriptionsRepo: SubscriptionsRepositoryI,
    ) {}

    private cacheKey(scope: string, key: string): string {
        return `idempotency:${scope}:${key}`
    }

    async getOrCreate(key: string, scope: string): Promise<{ isNew: boolean; result: unknown }> {
        const rKey = this.cacheKey(scope, key)

        const cached = await this.cache.get<{ status: IdempotencyStatus; result: unknown }>(rKey)
        if (cached) {
            if (cached.status === 'pending') {
                throw new ConflictException('Request is already being processed')
            }
            return { isNew: false, result: cached.result }
        }

        const existing = await this.subscriptionsRepo.fetchIdempotencyKey(key)
        if (existing) {
            if (existing.status === 'pending') {
                throw new ConflictException('Request is already being processed')
            }
            await this.cache.set(
                rKey,
                { status: existing.status, result: existing.result },
                CACHE_TTL_MS,
            )
            return { isNew: false, result: existing.result }
        }

        const now = new Date()
        await this.subscriptionsRepo.createIdempotencyKey({
            key,
            scope,
            status: 'pending',
            result: {},
            expiresAt: new Date(now.getTime() + KEY_TTL_MS),
        })
        await this.cache.set(rKey, { status: 'pending', result: null }, CACHE_TTL_MS)

        return { isNew: true, result: null }
    }

    async complete(
        key: string,
        scope: string,
        status: IdempotencyStatus,
        result: unknown,
    ): Promise<void> {
        await this.subscriptionsRepo.updateIdempotencyKey(key, status, result)
        await this.cache.set(this.cacheKey(scope, key), { status, result }, CACHE_TTL_MS)
    }
}
