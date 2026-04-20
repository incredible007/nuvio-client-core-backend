import * as schema from '@/database/schema'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { idempotencyKeys } from '@/database/schema'

export type Client = typeof schema.clients.$inferSelect & {
    paymentMethods?: (typeof schema.clientPaymentMethods.$inferSelect)[]
}

export type Subscriber = typeof schema.productSubscribers.$inferSelect

export type SubscriptionPrice = typeof schema.productPrices.$inferSelect & {
    product: typeof schema.products.$inferSelect
}

export type CreateSubscriptionDto = typeof schema.productSubscribers.$inferInsert

export const UpdateSubscriptionSchema = createUpdateSchema(schema.productSubscribers)
export type UpdateSubscriptionDto = z.infer<typeof UpdateSubscriptionSchema>

export const UpdateClientSchema = createUpdateSchema(schema.clients)
export type UpdateClientDto = z.infer<typeof UpdateClientSchema>

export type IdempotencyKey = typeof schema.idempotencyKeys.$inferSelect

export interface SubscriptionsRepositoryI {
    fetchClient(cid: number): Promise<Client>
    createSubscription(dto: CreateSubscriptionDto): Promise<Subscriber>
    updateSubscription(psid: number, dto: UpdateSubscriptionDto): Promise<Subscriber>
    updateSubscription(stripeSubID: string, dto: UpdateSubscriptionDto): Promise<Subscriber>
    updateClient(cid: number, dto: UpdateClientDto): Promise<Client>
    fetchSubscriptionPrice(stripePriceId: string): Promise<SubscriptionPrice>
    fetchSubscription(stripeSubID: string): Promise<Subscriber>
    fetchClientSubscriptions(cid: number): Promise<Subscriber[]>

    // idempotency
    fetchIdempotencyKey(key: string): Promise<IdempotencyKey | undefined>
    createIdempotencyKey(data: typeof idempotencyKeys.$inferInsert)
    updateIdempotencyKey(key: string, status: string, result: unknown)
    deleteExpiredIdempotencyKeys()
}

export const SUBSCRIPTIONS_REPOSITORY = Symbol.for('SUBSCRIPTIONS_REPOSITORY')
