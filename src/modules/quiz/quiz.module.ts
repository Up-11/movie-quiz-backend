import { Module } from '@nestjs/common'

import { FilmModule } from './film/film.module'
import { QuizController } from './quiz.controller'
import { QuizService } from './quiz.service'

@Module({
	controllers: [QuizController],
	providers: [QuizService],
	imports: [FilmModule]
})
export class QuizModule {}
