import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationService {
    async sendPaymentReminder(clientId: string, dto: object) {}
}
