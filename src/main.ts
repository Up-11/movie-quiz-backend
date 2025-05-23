import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as express from 'express'
import * as path from 'path'

import { CoreModule } from './core/core.module'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule)
	app.setGlobalPrefix('api')

	const config = app.get(ConfigService)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	})

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	)

	const port = config.get<number>('APPLICATION_PORT') || 4000

	app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
	await app.listen(port)
}
bootstrap()
