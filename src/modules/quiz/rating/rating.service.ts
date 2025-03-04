import { BadRequestException, Injectable } from '@nestjs/common'

import { DbService } from '@/src/core/db/db.service'

@Injectable()
export class RatingService {
	constructor(private readonly db: DbService) {}

	async updateQuizRating(quizId: string) {
		const completions = await this.db.userQuizCompletion.findMany({
			where: { quizId },
			select: { rating: true }
		})

		const ratings = completions
			.filter(
				completion => completion.rating !== null && completion.rating !== 0
			)
			.map(completion => completion.rating)

		if (ratings.length > 0) {
			const averageRating =
				ratings.reduce((sum, current) => sum + current, 0) / ratings.length

			await this.db.quiz.update({
				where: { id: quizId },
				data: {
					rating: averageRating
				}
			})
		}
	}

	async rateQuiz(quizId: string, userId: string, rating: number) {
		if (!quizId || !userId) {
			throw new BadRequestException(
				'Не переданы обязательные параметры: quizId или userId'
			)
		}
		const quiz = await this.db.userQuizCompletion.findUnique({
			where: { userId_quizId: { userId, quizId } }
		})

		if (!quiz) {
			throw new BadRequestException('Викторина не найдена')
		}

		const updatedUserQuiz = await this.db.userQuizCompletion.update({
			where: { id: quiz.id },
			data: {
				rating
			}
		})

		await this.updateQuizRating(quizId)

		return updatedUserQuiz
	}
}
