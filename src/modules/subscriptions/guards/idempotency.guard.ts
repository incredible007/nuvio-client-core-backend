import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { IdempotencyService } from '../services/idempotency.service'

const IDEMPOTENCY_HEADER = 'x-idempotency-key'

@Injectable()
export class IdempotencyGuard implements CanActivate {
    constructor(private readonly idempotencyService: IdempotencyService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>()
        const res = context.switchToHttp().getResponse<Response>()

        const key = req.headers[IDEMPOTENCY_HEADER] as string | undefined
        if (!key) throw new BadRequestException(`Missing ${IDEMPOTENCY_HEADER} header`)

        const { isNew, result } = await this.idempotencyService.getOrCreate(key, 'subscriptions')

        if (!isNew) {
            res.status(200).json(result)
            return false
        }

        req['idempotencyKey'] = key
        return true
    }
}
