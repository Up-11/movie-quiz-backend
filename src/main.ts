import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { CoreModule } from './core/core.module'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule)
	app.setGlobalPrefix('api')
	const config = app.get(ConfigService)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	})
	await app.listen(config.getOrThrow<number>('APPLICATION_PORT') ?? 8000)
}
bootstrap()
