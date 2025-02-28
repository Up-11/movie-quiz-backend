import { Injectable } from '@nestjs/common'
import { UserQuizCompletion } from '@prisma/client'

@Injectable()
export class StatisticService {
	getUserStatistics(completions: UserQuizCompletion[]) {
		if (completions.length === 0) {
			return { correctAnswersPercentage: 0, totalQuizzes: 0 }
		}

		const totalCorrectAnswers = completions.reduce(
			(acc, completion) => acc + completion.correctAnswers,
			0
		)
		const totalFailedAnswers = completions.reduce(
			(acc, completion) => acc + completion.failedAnswers,
			0
		)
		const totalQuestions = totalCorrectAnswers + totalFailedAnswers

		const totalQuizzes = completions.length

		const correctAnswersPercentage =
			totalQuestions > 0
				? Number(((totalCorrectAnswers / totalQuestions) * 100).toFixed(2))
				: 0

		return {
			correctAnswersPercentage,
			totalQuizzes
		}
	}
}
