import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(4, {
		message: 'Пароль должен быть не меньше 4 символов'
	})
	@IsString()
	password: string

	@IsString()
	@MinLength(3, {
		message: 'Имя должно быть не меньше 3 символов'
	})
	name: string

	@IsEnum(Role)
	role: Role
}
