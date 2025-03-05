import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { genSalt, hash } from 'bcryptjs'

import { DbService } from '@/src/core/db/db.service'

import { UpdateUserDto } from './dto/update.user.dto'
import { StatisticService } from './statistic/statistic.service'

@Injectable()
export class UserService {
	constructor(
		private readonly db: DbService,
		private statistic: StatisticService
	) {}

	async getAllUsers(role: Role, searchTerm?: string) {
		if (!role) throw new NotFoundException('Роль обязательна')
		const users = await this.db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true
			},
			where: {
				role,
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
							email: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
				})
			}
		})

		return users
	}

	async updateProfile(id: string, dto: UpdateUserDto) {
		const existingUser = await this.db.user.findUnique({
			where: { id }
		})
		if (!existingUser) throw new NotFoundException('Пользователь не найден')

		if (dto.email && dto.email !== existingUser.email) {
			const emailExists = await this.db.user.findUnique({
				where: { email: dto.email, NOT: { id: existingUser.id } }
			})
			if (emailExists)
				throw new BadRequestException(
					'Пользователь с таким email уже существует'
				)
		}

		const data: Partial<UpdateUserDto> = {}
		if (dto.email) data.email = dto.email
		if (dto.name) data.name = dto.name
		if (dto.password) {
			const salt = await genSalt(10)
			data.password = await hash(dto.password, salt)
		}

		await this.db.user.update({
			where: { id },
			data
		})
		return this.db.user.findUnique({ where: { id }, omit: { password: true } })
	}

	async deleteProfileById(id: string) {
		return this.db.user.delete({
			where: { id }
		})
	}
	async getUserStatistics(userId: string) {
		const completions = await this.db.userQuizCompletion.findMany({
			where: { userId }
		})
		const result = this.statistic.getUserStatistics(completions)

		return result
	}
}
