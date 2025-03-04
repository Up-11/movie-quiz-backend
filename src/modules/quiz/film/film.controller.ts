import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query
} from '@nestjs/common'

import { Auth } from '@/src/shared/decorators/auth.decorator'

import { QUIZ_ROUTES } from '../config/quiz.routes'

import { FilmService } from './film.service'

@Controller(QUIZ_ROUTES.FILM_INDEX)
export class FilmController {
	constructor(private readonly filmService: FilmService) {}

	@HttpCode(200)
	@Auth('ADMIN')
	@Get(QUIZ_ROUTES.ALL_FILMS)
	async getAllFilms(@Query('searchTerm') searchTerm?: string) {
		return this.filmService.getAllFilms(searchTerm)
	}

	@HttpCode(200)
	@Auth('ADMIN')
	@Post(QUIZ_ROUTES.ADD_FILM)
	async addFilm(@Body('title') title: string) {
		return this.filmService.addFilm(title)
	}

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete(QUIZ_ROUTES.DELETE_FILM)
	async deleteFilm(@Param('title') title: string) {
		return this.filmService.deleteFilm(title)
	}
}
