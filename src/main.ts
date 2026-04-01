import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    )

    const config = new DocumentBuilder()
        .setTitle('Catalog API')
        .setDescription('REST API для каталога товаров')
        .setVersion('0.3.1')
        .addTag('catalog')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)

    await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
