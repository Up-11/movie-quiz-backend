import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Query
} from '@nestjs/common'
import { Role } from '@prisma/client'

import { Auth } from '@/src/shared/decorators/auth.decorator'
import { CurrentUser } from '@/src/shared/decorators/current.user.decorator'

import { USER_ROUTES } from './config/user.routes'
import { UpdateUserDto } from './dto/update.user.dto'
import { UserService } from './user.service'

@Controller(USER_ROUTES.INDEX)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@HttpCode(200)
	@Auth('ADMIN')
	@Get(USER_ROUTES.ALL_USERS)
	async getAllUsers(
		@Body('role') role: Role,
		@Query('searchTerm') searchTerm?: string
	) {
		return this.userService.getAllUsers(searchTerm, role)
	}

	@HttpCode(200)
	@Auth('USER')
	@Get(USER_ROUTES.GET_STATISTIC)
	async getUserStatistic(@CurrentUser('id') id: string) {
		return this.userService.getUserStatistics(id)
	}

	@HttpCode(200)
	@Patch(USER_ROUTES.PROFILE)
	@Auth()
	async updateProfile(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@HttpCode(200)
	@Delete(USER_ROUTES.DELETE_SELF_ACC)
	@Auth()
	async deleteSelfProfile(@CurrentUser('id') id: string) {
		return this.userService.deleteProfileById(id)
	}

	@HttpCode(200)
	@Delete(USER_ROUTES.DELETE_USER_BY_ID)
	@Auth('ADMIN')
	async deleteUserById(@Param('id') id: string) {
		return this.userService.deleteProfileById(id)
	}
}
