import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export interface JwtPayload {
    cid: number
    email: string
}

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return request.user as JwtPayload
})
