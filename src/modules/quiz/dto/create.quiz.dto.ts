import { Type } from 'class-transformer'
import { IsArray, IsString, ValidateNested } from 'class-validator'

class CreateAnswerVariantDto {
	@IsString()
	variant!: string
}

class CreateQuestionDto {
	@IsString()
	question!: string

	@IsString()
	description!: string

	@IsString()
	imageUrl!: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateAnswerVariantDto)
	answers!: CreateAnswerVariantDto[]
}

export class CreateQuizDto {
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
