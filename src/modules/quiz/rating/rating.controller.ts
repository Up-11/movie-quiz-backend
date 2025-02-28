import { Body, Controller, HttpCode, Param, Patch } from '@nestjs/common'

import { Auth } from '@/src/shared/decorators/auth.decorator'
import { CurrentUser } from '@/src/shared/decorators/current.user.decorator'

import { QUIZ_ROUTES } from '../config/quiz.routes'

import { RatingService } from './rating.service'

@Controller(QUIZ_ROUTES.RATING_INDEX)
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@HttpCode(200)
	@Auth('USER')
	@Patch(QUIZ_ROUTES.RATE_QUIZ)
	async rateQuiz(
		@Param('id') quizId: string,
		@Body('rating') rating: number,
		@CurrentUser('id') userId: string
	) {
		return this.ratingService.rateQuiz(quizId, userId, rating)
	}
}
