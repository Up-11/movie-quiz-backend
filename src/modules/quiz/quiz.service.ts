import { BadRequestException, Injectable } from '@nestjs/common'

import { DbService } from '@/src/core/db/db.service'

import { CompleteQuizDto } from './dto/complete.quiz.dto'
import { CreateQuizDto } from './dto/create.quiz.dto'
import { SearchType } from './search.type'

@Injectable()
export class QuizService {
	constructor(private readonly db: DbService) {}

	async searchQuizzes(searchTerm?: string, searchBy?: SearchType) {
		if (searchBy === 'film') {
			const quizzes = await this.db.quiz.findMany({
				include: { film: true },
				where: {
					film: {
						...(searchTerm && {
							title: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						})
					}
				}
			})
			return quizzes
		} else if (searchBy === 'name') {
			const quizzes = await this.db.quiz.findMany({
				include: { film: true },
				where: {
					...(searchTerm && {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					})
				}
			})
			return quizzes
		}
	}

	async getAllQuizzes() {
		return this.db.quiz.findMany({
			include: {
				film: true
			}
		})
	}
	async deleteQuizById(id: string) {
		return this.db.quiz.delete({
			where: { id }
		})
	}
	async createQuiz(dto: CreateQuizDto) {
		console.log('DTO:', dto)

		if (dto.questions.length === 0)
			throw new BadRequestException('Нужно добавить хотя бы один вопрос')

		const newQuiz = await this.db.quiz.create({
			data: {
				name: dto.name,
				description: dto.description,
				imageUrl: dto.imageUrl,
				film: { connect: { id: dto.filmId } },
				questions: {
					create: dto.questions.map(q => ({
						question: q.question,
						description: q.description,
						imageUrl: q.imageUrl,
						answers: {
							create: q.answers.map(a => ({
								variant: a.variant
							}))
						}
					}))
				}
			},
			include: {
				questions: {
					include: { answers: true }
				},
				film: true
			}
		})

		return newQuiz
	}

	async getQuizById(id: string) {
		return this.db.quiz.findUnique({
			where: { id },
			include: {
				questions: {
					include: { answers: true }
				},
				film: true
			}
		})
	}

	async getAllAuthQuizzes(userId: string) {
		return this.db.quiz.findMany({
			include: {
				film: true,
				completions: {
					where: { userId }
				}
			}
		})
	}

	async getUserCompletions(userId: string) {
		return this.db.userQuizCompletion.findMany({
			where: { userId }
		})
	}
	async completeQuiz(dto: CompleteQuizDto, userId: string) {
		if (!dto.quizId) throw new BadRequestException('АйДи не указан')
		if (!dto.correctAnswers)
			throw new BadRequestException('Не были переданы правильные ответы')
		if (!dto.failedAnswers)
			throw new BadRequestException('Не были переданы неправильные ответы')
		return this.db.userQuizCompletion.create({
			data: {
				quiz: { connect: { id: dto.quizId } },
				user: { connect: { id: userId } },
				correctAnswers: dto.correctAnswers,
				failedAnswers: dto.failedAnswers
			}
		})
	}
}
