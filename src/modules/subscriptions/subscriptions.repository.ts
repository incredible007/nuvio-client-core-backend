import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
    Client,
    CreateSubscriptionDto,
    IdempotencyKey,
    Subscriber,
    SubscriptionPrice,
    SubscriptionsRepositoryI,
    UpdateClientDto,
    UpdateSubscriptionDto,
} from '@/modules/subscriptions/interfaces/subscriptions-repository.interface'
import { DB_DRIZZLE } from '@/database/database.module'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '@/database/schema'
import { idempotencyKeys, productPrices, products } from '@/database/schema'
import { and, eq, getTableColumns, lt } from 'drizzle-orm'

@Injectable()
export class SubscriptionsRepository implements SubscriptionsRepositoryI {
    constructor(
        @Inject(DB_DRIZZLE)
        private readonly db: PostgresJsDatabase<typeof schema>,
    ) {}

    async fetchSubscription(stripeSubID: string): Promise<Subscriber> {
        const [sub] = await this.db
            .select()
            .from(schema.productSubscribers)
            .where(eq(schema.productSubscribers.stripeSubscriptionId, stripeSubID))
            .limit(1)

        if (!sub) throw new NotFoundException()

        return sub
    }

    async fetchClientSubscriptions(cid: number): Promise<Subscriber[]> {
        return this.db
            .select()
            .from(schema.productSubscribers)
            .where(and(eq(schema.productSubscribers.cid, cid)))
    }

    async updateClient(cid: number, dto: UpdateClientDto): Promise<Client> {
        const [client] = await this.db
            .update(schema.clients)
            .set(dto)
            .where(eq(schema.clients.cid, cid))
            .returning()

        if (!client) throw new NotFoundException()

        return client
    }

    async fetchClient(cid: number): Promise<Client> {
        const paymentMethods = await this.db
            .select()
            .from(schema.clientPaymentMethods)
            .where(
                and(
                    eq(schema.clientPaymentMethods.clientId, cid),
                    eq(schema.clientPaymentMethods.isArchived, false),
                ),
            )

        const [client] = await this.db
            .select()
            .from(schema.clients)
            .where(and(eq(schema.clients.cid, cid), eq(schema.clients.isArchived, false)))
            .limit(1)

        if (!client) throw new NotFoundException()

        return {
            ...client,
            paymentMethods,
        }
    }

    async createSubscription(dto: CreateSubscriptionDto): Promise<Subscriber> {
        const [subscriber] = await this.db.insert(schema.productSubscribers).values(dto).returning()

        if (!subscriber) throw new NotFoundException()

        return subscriber
    }

    async updateSubscription(stripeSubID: string, dto: UpdateSubscriptionDto): Promise<Subscriber>
    async updateSubscription(psid: number, dto: UpdateSubscriptionDto): Promise<Subscriber>
    async updateSubscription(
        psidOrStripeSubID: number | string,
        dto: UpdateSubscriptionDto,
    ): Promise<Subscriber> {
        const whereClause =
            typeof psidOrStripeSubID === 'string'
                ? eq(schema.productSubscribers.stripeSubscriptionId, psidOrStripeSubID)
                : eq(schema.productSubscribers.psid, psidOrStripeSubID)

        const [subscriber] = await this.db
            .update(schema.productSubscribers)
            .set(dto)
            .where(whereClause)
            .returning()

        if (!subscriber) throw new NotFoundException()

        return subscriber
    }

    async fetchSubscriptionPrice(stripePriceId: string): Promise<SubscriptionPrice> {
        const [price] = await this.db
            .select({
                ...getTableColumns(schema.productPrices),
                product: getTableColumns(schema.products),
            })
            .from(schema.productPrices)
            .innerJoin(products, eq(products.pid, productPrices.pid))
            .where(
                and(
                    eq(products.isArchived, false),
                    eq(schema.productPrices.stripePriceId, stripePriceId),
                ),
            )
            .limit(1)

        if (!price) throw new NotFoundException()

        return price
    }

    async fetchIdempotencyKey(key: string): Promise<IdempotencyKey | undefined> {
        const [row] = await this.db
            .select()
            .from(idempotencyKeys)
            .where(eq(idempotencyKeys.key, key))
            .limit(1)

        return row
    }

    async createIdempotencyKey(data: typeof idempotencyKeys.$inferInsert): Promise<void> {
        await this.db.insert(idempotencyKeys).values(data)
    }

    async updateIdempotencyKey(key: string, status: string, result: unknown): Promise<void> {
        await this.db
            .update(idempotencyKeys)
            .set({ status, result })
            .where(eq(idempotencyKeys.key, key))
    }

    async deleteExpiredIdempotencyKeys(): Promise<void> {
        await this.db.delete(idempotencyKeys).where(lt(idempotencyKeys.expiresAt, new Date()))
    }
}
