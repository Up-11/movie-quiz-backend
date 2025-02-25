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
import { AuthDto } from './dto/auth.dto'

@Controller(AUTH_ROUTES.AUTH)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(AUTH_ROUTES.LOGIN)
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(AUTH_ROUTES.REGISTER)
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}
}
