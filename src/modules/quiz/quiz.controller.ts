import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query
} from '@nestjs/common'

import { Auth } from '@/src/shared/decorators/auth.decorator'
import { CurrentUser } from '@/src/shared/decorators/current.user.decorator'

import { QUIZ_ROUTES } from './config/quiz.routes'
import { CompleteQuizDto } from './dto/complete.quiz.dto'
import { CreateQuizDto } from './dto/create.quiz.dto'
import { QuizService } from './quiz.service'
import { SearchType } from './search.type'

@Controller(QUIZ_ROUTES.INDEX)
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@HttpCode(200)
	@Get(QUIZ_ROUTES.GET_ALL)
	async getAllQuizzes(@Query('searchTerm') searchTerm?: string) {
		return this.quizService.getAllQuizzes(searchTerm)
	}

	@HttpCode(200)
	@Auth('USER')
	@Get(QUIZ_ROUTES.GET_ALL_AUTH)
	async getAllAuthQuizzes(@CurrentUser('id') userId: string) {
		return this.quizService.getAllAuthQuizzes(userId)
	}

	@HttpCode(200)
	@Post(QUIZ_ROUTES.COMPLETE_QUIZ_AUTH)
	@Auth('USER')
	async completeQuizAuth(
		@Body() dto: CompleteQuizDto,
		@CurrentUser('id') userId: string
	) {
		return this.quizService.completeQuiz(dto, userId)
	}
	@HttpCode(200)
	@Post(QUIZ_ROUTES.COMPLETE_QUIZ_UNAUTH)
	async completeQuizUnAuth(@Body() dto: CompleteQuizDto) {
		return this.quizService.completeQuiz(dto)
	}

	@HttpCode(200)
	@Auth('USER')
	@Get(QUIZ_ROUTES.GET_USER_COMPLETIONS)
	async getUserCompletions(@CurrentUser('id') userId: string) {
		return this.quizService.getUserCompletions(userId)
	}

	@HttpCode(200)
	@Get(QUIZ_ROUTES.GET_BY_ID)
	async getQuizById(@Param('id') id: string, @Query('userId') userId?: string) {
		return this.quizService.getQuizById(id, userId)
	}

	@HttpCode(200)
	@Get(QUIZ_ROUTES.SEARCH)
	async searchQuiz(
		@Query('searchTerm') searchTerm?: string,
		@Query('searchBy') searchBy?: SearchType
	) {
		return this.quizService.searchQuizzes(searchTerm, searchBy)
	}

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete(QUIZ_ROUTES.DELETE)
	async deleteQuiz(@Param('id') id: string) {
		return this.quizService.deleteQuizById(id)
	}

	@HttpCode(200)
	@Auth('ADMIN')
	@Post(QUIZ_ROUTES.CREATE)
	async createQuiz(@Body() dto: CreateQuizDto) {
		return this.quizService.createQuiz(dto)
	}
}
