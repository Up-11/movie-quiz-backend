import { Type } from 'class-transformer'
import { IsArray, IsString, ValidateNested } from 'class-validator'

export class CreateAnswerVariantDto {
	@IsString()
	id: string

	@IsString()
	variant!: string
}

export class CreateQuestionDto {
	@IsString()
	id: string

	@IsString()
	question!: string

	@IsString()
	description!: string

	@IsString()
	imageUrl!: string

	@IsString()
	correctAnswerId!: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateAnswerVariantDto)
	answers!: CreateAnswerVariantDto[]
}

export class CreateQuizDto {
	@IsString()
	id: string

	@IsString()
	name!: string

	@IsString()
	description!: string

	@IsString()
	imageUrl!: string

	@IsString()
	filmId!: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateQuestionDto)
	questions!: CreateQuestionDto[]
}
