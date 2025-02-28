import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'

import { AuthGuard } from '@/src/modules/auth/guards/auth.guard'

import { RolesGuard } from '../guards/roles.guard'

export function Auth(...roles: Role[]) {
	return applyDecorators(
		SetMetadata('roles', roles),
		UseGuards(AuthGuard, RolesGuard)
	)
}
