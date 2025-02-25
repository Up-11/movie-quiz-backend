import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { compare, genSalt, hash } from 'bcryptjs'

import { DbService } from '@/src/core/db/db.service'

import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly db: DbService,
		private readonly jwtService: JwtService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id)
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.db.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (oldUser) throw new BadRequestException('User already exists')

		const salt = await genSalt(10)

		const newUser = await this.db.user.create({
			data: {
				name: dto.name,
				password: await hash(dto.password, salt),
				email: dto.email,
				role: dto.role
			}
		})

		return {
			user: this.returnUserFields(newUser),
			accessToken: await this.issueAccessToken(newUser.id)
		}
	}

	async validateUser(dto: AuthDto): Promise<User> {
		const user = await this.db.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user) throw new UnauthorizedException('Пользователь не найден')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Неверный пароль')

		return user
	}

	async issueAccessToken(userId: string) {
		const data = { id: userId }

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '31d'
		})

		return accessToken
	}

	returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role
		}
	}
}
