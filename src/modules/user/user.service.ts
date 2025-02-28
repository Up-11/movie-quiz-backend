import { Injectable, NotFoundException } from '@nestjs/common'
import { Role } from '@prisma/client'
import { genSalt } from 'bcryptjs'
import { hash } from 'crypto'

import { DbService } from '@/src/core/db/db.service'

import { UpdateUserDto } from './dto/update.user.dto'
import { StatisticService } from './statistic/statistic.service'

@Injectable()
export class UserService {
	constructor(
		private readonly db: DbService,
		private statistic: StatisticService
	) {}

	async getAllUsers(searchTerm: string, role: Role) {
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
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				})
			}
		})

		return users
	}
	async updateProfile(id: string, dto: UpdateUserDto) {
		const existingUser = await this.db.user.findUnique({
			where: {
				id
			}
		})
		if (!existingUser) throw new NotFoundException('Пользователь не найден')

		if (dto.email) {
			const emailExists = await this.db.user.findUnique({
				where: {
					email: dto.email
				}
			})
			if (emailExists)
				throw new NotFoundException('Пользователь с таким email уже существует')
		}

		const data: UpdateUserDto = {
			email: dto.email,
			name: dto.name
		}
		if (dto.password) {
			const salt = await genSalt(10)
			data.password = await hash(dto.password, salt)
		}

		return this.db.user.update({
			where: { id },
			data
		})
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
