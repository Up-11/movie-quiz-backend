import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { AUTH_ROUTES } from './config/auth.routes'
import { LoginDto, RegisterDto } from './dto/auth.dto'

@Controller(AUTH_ROUTES.INDEX)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(AUTH_ROUTES.LOGIN)
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(AUTH_ROUTES.REGISTER)
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(AUTH_ROUTES.CREATE_ADMIN)
	async createNewAdmin(@Body() dto: RegisterDto) {
		return this.authService.createAdminAccount(dto)
	}
}
