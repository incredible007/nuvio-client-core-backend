import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { CatalogModule } from './modules/catalog/catalog.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { appConfig } from '@/config/app.config'
import { envSchema } from '@/config/env.schema'
import { redisConfig } from '@/config/redis.config'
import { DatabaseModule } from '@/database/database.module'
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module'
import { createKeyv } from '@keyv/redis'
import { BullModule } from '@nestjs/bullmq'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, redisConfig],
            validate: (env) => {
                const result = envSchema.safeParse(env)
                if (!result.success) {
                    console.error('❌ Invalid env:', result.error.flatten().fieldErrors)
                    process.exit(1)
                }
                return result.data
            },
        }),

        BullModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                connection: {
                    host: config.get<string>('redis.host'),
                    port: config.get<number>('redis.port'),
                },
            }),
            inject: [ConfigService],
        }),

        CacheModule.registerAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const host = config.get<string>('redis.host')
                const port = config.get<number>('redis.port')
                const ttl = config.get<number>('redis.ttl')

                const redisStore = createKeyv(`redis://${host}:${port}`)

                redisStore.on('error', (err) => {
                    console.error(
                        '❌ Redis connection failed, falling back to in-memory:',
                        err.message,
                    )
                })

                return {
                    stores: [redisStore],
                    ttl,
                }
            },
        }),

        CatalogModule,
        DatabaseModule,
        SubscriptionsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
