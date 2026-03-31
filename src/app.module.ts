import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ioRedisStore } from '@tirke/node-cache-manager-ioredis'
import { CatalogModule } from './modules/catalog/catalog.module'
import { ConfigModule } from '@nestjs/config'
import { appConfig } from '@/config/app.config'
import { envSchema } from '@/config/env.schema'
import { redisConfig } from '@/config/redis.config'
import { DatabaseModule } from '@/database/database.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, redisConfig],
            validate: (env) => {
                const result = envSchema.safeParse(env)
                if (!result.success) {
                    console.error(
                        '❌ Invalid env:',
                        result.error.flatten().fieldErrors,
                    )
                    process.exit(1)
                }
                return result.data
            },
        }),

        CacheModule.register({
            isGlobal: true,
            store: ioRedisStore,
            host: 'localhost',
            port: 6379,
            ttl: 60,
        }),
        CatalogModule,
        DatabaseModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
