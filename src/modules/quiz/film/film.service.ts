import { BadRequestException, Injectable } from '@nestjs/common'

import { DbService } from '@/src/core/db/db.service'

@Injectable()
export class FilmService {
	constructor(private readonly db: DbService) {}

	async getAllFilms(searchTerm?: string) {
		return await this.db.film.findMany({
			where: {
				...(searchTerm && {
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				})
			}
		})
	}
	async addFilm(title: string) {
		const existingFilm = await this.db.film.findFirst({
			where: {
				title
			}
		})
		if (existingFilm) throw new BadRequestException('Фильм уже существует')

		return this.db.film.create({
			data: {
				title
			}
		})
	}

	async deleteFilm(title: string) {
		return this.db.film.delete({
			where: {
				title
			}
		})
	}
}
