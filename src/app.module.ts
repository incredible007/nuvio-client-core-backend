import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ioRedisStore } from '@tirke/node-cache-manager-ioredis';
import { CatalogModule } from './modules/catalog/catalog.module';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            store: ioRedisStore,
            host: 'localhost',
            port: 6379,
            ttl: 60,
        }),
        CatalogModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
