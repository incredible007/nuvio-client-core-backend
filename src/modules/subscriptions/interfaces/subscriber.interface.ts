import * as schema from '@/database/schema'

export type Subscriber = typeof schema.productSubscribers.$inferSelect & {}
