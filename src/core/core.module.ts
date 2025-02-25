import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '../modules/auth/auth.module'
import { QuizModule } from '../modules/quiz/quiz.module'
import { StatisticModule } from '../modules/statistic/statistic.module'
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
		StatisticModule,
		DbModule
	],
	providers: [DbService]
})
export class CoreModule {}
