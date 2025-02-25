import { UseGuards } from '@nestjs/common'

import { AuthGuard } from '../guards/auth.guard'

export const Auth = () => UseGuards(AuthGuard)
