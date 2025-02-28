import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '../modules/auth/auth.module'
import { MediaModule } from '../modules/media/media.module'
import { QuizModule } from '../modules/quiz/quiz.module'
import { RatingModule } from '../modules/quiz/rating/rating.module'
import { UserModule } from '../modules/user/user.module'
import { IS_DEV } from '../shared/utils/is-dev.util'

import { DbModule } from './db/db.module'
import { DbService } from './db/db.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV,
			isGlobal: true
		}),
		UserModule,
		AuthModule,
		QuizModule,
		DbModule,
		MediaModule,
		RatingModule
	],
	providers: [DbService]
})
export class CoreModule {}
