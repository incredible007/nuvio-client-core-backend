import { ApiTags } from '@nestjs/swagger'
import { Controller } from '@nestjs/common'

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {}
