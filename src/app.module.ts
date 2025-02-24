import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbService } from './db/db.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { QuizModule } from './quiz/quiz.module'
import { StatisticModule } from './statistic/statistic.module'

@Module({
  imports: [UserModule, AuthModule, QuizModule, StatisticModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
