import { Module } from '@nestjs/common'
import { QuizService } from './quiz.service'
import { QuizController } from './quiz.controller'
import { FilmModule } from './film/film.module'

@Module({
  controllers: [QuizController],
  providers: [QuizService],
  imports: [FilmModule],
})
export class QuizModule {}
