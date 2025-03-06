import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { DbService } from '@/src/core/db/db.service'

import { CompleteQuizDto } from './dto/complete.quiz.dto'
import { CreateQuizDto } from './dto/create.quiz.dto'
import { SearchType } from './search.type'

@Injectable()
export class QuizService {
	constructor(private readonly db: DbService) {}

	async searchQuizzes(searchTerm?: string, searchBy?: SearchType) {
		if (searchBy === 'film') {
			return await this.db.quiz.findMany({
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
		} else if (searchBy === 'name') {
			return this.db.quiz.findMany({
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
		}
	}

	async getAllQuizzes(searchTerm?: string) {
		const quizzes = await this.db.quiz.findMany({
			where: {
				...(searchTerm && {
					OR: [
						{
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							id: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							film: {
								title: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							}
						}
					]
				})
			},
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
		const filteredQuizzes = quizzes.map(curr => {
			return {
				...curr,
				_count: {
					completions: curr.completionsCount,
					questions: curr._count.questions
				}
			}
		})
		return filteredQuizzes
	}
	async deleteQuizById(id: string) {
		return this.db.quiz.delete({
			where: { id }
		})
	}
	async createQuiz(dto: CreateQuizDto) {
		console.log('DTO:', JSON.stringify(dto, null, 2))

		if (!dto.id || typeof dto.id !== 'string') {
			throw new BadRequestException('Некорректный id викторины')
		}
		if (!dto.name || typeof dto.name !== 'string') {
			throw new BadRequestException('Название викторины (name) обязательно')
		}
		if (!dto.description || typeof dto.description !== 'string') {
			throw new BadRequestException(
				'Описание викторины (description) обязательно'
			)
		}
		/* 	if (!dto.imageUrl || typeof dto.imageUrl !== 'string') {
			throw new BadRequestException(
				'Ссылка на изображение (imageUrl) обязательна'
			)
		} */
		if (!dto.filmId || typeof dto.filmId !== 'string') {
			throw new BadRequestException('Не указан Фильм или он некорректен')
		}

		if (
			!dto.questions ||
			!Array.isArray(dto.questions) ||
			dto.questions.length === 0
		) {
			throw new BadRequestException('Нужно добавить хотя бы один вопрос')
		}

		const questionIds = new Set()
		for (const question of dto.questions) {
			if (!question.id || typeof question.id !== 'string') {
				throw new BadRequestException('Некорректный id у одного из вопросов')
			}
			if (questionIds.has(question.id)) {
				throw new BadRequestException(`Дубликат id вопроса: ${question.id}`)
			}
			questionIds.add(question.id)

			if (!question.question || typeof question.question !== 'string') {
				throw new BadRequestException(
					`Текст вопроса (question) обязателен для вопроса ${question.id}`
				)
			}
			if (!question.description || typeof question.description !== 'string') {
				throw new BadRequestException(
					`Описание (description) обязательно для вопроса ${question.id}`
				)
			}
			/* 	if (!question.imageUrl || typeof question.imageUrl !== 'string') {
				throw new BadRequestException(
					`Ссылка на изображение (imageUrl) обязательна для вопроса ${question.id}`
				)
			} */
			if (
				!question.answers ||
				!Array.isArray(question.answers) ||
				question.answers.length === 0
			) {
				throw new BadRequestException(
					`Вопрос (id: ${question.id}) должен иметь хотя бы один ответ`
				)
			}

			const answerIds = new Set()
			for (const answer of question.answers) {
				if (!answer.id || typeof answer.id !== 'string') {
					throw new BadRequestException(
						`Некорректный id у одного из ответов в вопросе ${question.id}`
					)
				}
				if (answerIds.has(answer.id)) {
					throw new BadRequestException(
						`Дубликат id ответа: ${answer.id} в вопросе ${question.id}`
					)
				}
				answerIds.add(answer.id)

				if (!answer.variant || typeof answer.variant !== 'string') {
					throw new BadRequestException(
						`Вариант ответа обязателен в вопросе ${question.id}`
					)
				}
			}

			if (
				question.correctAnswerId &&
				!answerIds.has(question.correctAnswerId)
			) {
				throw new BadRequestException(
					`Правильный ответ (id: ${question.correctAnswerId}) не найден среди ответов вопроса ${question.id}`
				)
			}
		}

		const correctAnswers = dto.questions
			.map(q => q.correctAnswerId)
			.filter(Boolean)
		console.log('Correct Answers:', correctAnswers)

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

	async getQuizById(id: string, userId?: string) {
		const currentQuiz = await this.db.quiz.findUnique({
			omit: {
				createdAt: true,
				filmId: true
			},
			where: { id },
			include: {
				completions: {
					select: {
						id: true
					}
				},
				questions: {
					omit: { createdAt: true, quizId: true, correctAnswerId: true },
					include: {
						correctAnswer: {
							omit: { questionId: true, createdAt: true }
						},
						answers: {
							omit: { questionId: true, createdAt: true }
						}
					}
				},
				film: {
					select: {
						title: true
					}
				}
			}
		})

		if (!currentQuiz) throw new NotFoundException('Викторина не найдена')
		if (userId) {
			const completedQuiz = await this.db.userQuizCompletion.findFirst({
				where: { userId, quizId: currentQuiz.id }
			})

			return {
				...currentQuiz,
				_count: {
					completions: currentQuiz.completionsCount,
					questions: currentQuiz.questions.length
				},
				completed: completedQuiz ? true : false,
				userRating: completedQuiz ? completedQuiz.rating : null
			}
		}
		return currentQuiz
	}

	async getAllAuthQuizzes(userId: string) {
		const quizzes = await this.db.quiz.findMany({
			omit: { filmId: true },
			include: {
				film: {
					select: {
						title: true
					}
				},
				completions: {
					where: { userId }
				},
				questions: {
					select: {
						id: true
					}
				}
			}
		})
		const filteredQuizzes = quizzes.map(curr =>
			curr.completions.length > 0
				? {
						...curr,
						completed: true,
						_count: {
							completions: curr.completionsCount,
							questions: curr.questions.length
						}
					}
				: {
						...curr,
						completed: false,
						_count: {
							completions: curr.completionsCount,
							questions: curr.questions.length
						}
					}
		)
		return filteredQuizzes
	}

	async getUserCompletions(userId: string) {
		return this.db.userQuizCompletion.findMany({
			where: { userId },
			include: {
				quiz: {
					include: {
						film: {
							select: { title: true }
						}
					}
				}
			}
		})
	}
	async completeQuiz(dto: CompleteQuizDto, userId?: string) {
		if (!dto.quizId) throw new BadRequestException('АйДи не указан')

		const quiz = await this.db.quiz.findUnique({
			where: { id: dto.quizId }
		})
		if (!quiz) throw new BadRequestException('Викторина не найдена')

		if (!userId) {
			return this.db.quiz.update({
				where: { id: quiz.id },
				data: {
					completionsCount: { increment: 1 }
				}
			})
		}
		await this.db.quiz.update({
			where: { id: quiz.id },
			data: {
				completionsCount: { increment: 1 }
			}
		})

		const existingCompletion = await this.db.userQuizCompletion.findUnique({
			where: {
				userId_quizId: {
					quizId: dto.quizId,
					userId
				}
			}
		})

		if (existingCompletion)
			throw new BadRequestException('Вы уже прошли эту викторину')

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
