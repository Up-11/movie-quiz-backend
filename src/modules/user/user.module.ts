import { Module } from '@nestjs/common'

import { StatisticService } from './statistic/statistic.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, StatisticService]
})
export class UserModule {}
