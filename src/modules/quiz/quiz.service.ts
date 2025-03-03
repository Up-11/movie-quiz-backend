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
				film: {
					select: { title: true }
				},
				_count: {
					select: {
						completions: true,
						questions: true
					}
				}
			},
			omit: {
				createdAt: true,
				filmId: true
			}
		})
	}
	async deleteQuizById(id: string) {
		return this.db.quiz.delete({
			where: { id }
		})
	}
	async createQuiz(dto: CreateQuizDto) {
		console.log('DTO:', JSON.stringify(dto, null, 2))

		if (dto.questions.length === 0)
			throw new BadRequestException('Нужно добавить хотя бы один вопрос')

		const correctAnswers = dto.questions.map(curr => curr.correctAnswerId)
		console.log(correctAnswers)

		const newQuiz = await this.db.quiz.create({
			data: {
				id: dto.id,
				name: dto.name,
				description: dto.description,
				imageUrl: dto.imageUrl,
				film: { connect: { id: dto.filmId } },
				questions: {
					create: dto.questions.map(q => ({
						id: q.id,
						question: q.question,
						description: q.description,
						imageUrl: q.imageUrl,
						answers: {
							create: q.answers.map(a => ({
								id: a.id,
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

		await Promise.all(
			newQuiz.questions.map(async question => {
				const correctAnswer = question.answers.find(a => {
					console.log(a)
					return correctAnswers.includes(a.id)
				})
				console.log(correctAnswer)

				if (!correctAnswer) {
					throw new BadRequestException(
						`Правильный ответ для вопроса с id ${question.id} не найден`
					)
				}

				await this.db.question.update({
					where: { id: question.id },
					data: {
						correctAnswerId: correctAnswer.id
					}
				})
			})
		)

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
