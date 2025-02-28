import { IsNumber, IsString } from 'class-validator'

export class CompleteQuizDto {
	@IsString()
	quizId: string

	@IsNumber()
	correctAnswers: number

	@IsNumber()
	failedAnswers: number
}
