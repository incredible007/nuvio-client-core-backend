import { Inject, Injectable, Logger } from '@nestjs/common'
import { DB_DRIZZLE } from '@/database/database.module'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '@/database/schema'
import { AuditLogEntry } from '@/modules/subscriptions/interfaces/audit-log.types'

@Injectable()
export class AuditLogService {
    private readonly logger = new Logger(AuditLogService.name)

    constructor(
        @Inject(DB_DRIZZLE)
        private readonly db: PostgresJsDatabase<typeof schema>,
    ) {}

    async log(entry: AuditLogEntry): Promise<void> {
        await this.db.insert(schema.subscriptionAuditLogs).values({
            psid: Number(entry.resourceId),
            action: entry.action,
            actorId: entry.actorId,
            actorType: entry.actorType,
            metadata: entry.meta ?? {},
        })

        this.logger.log(
            `[AUDIT] ${entry.action} | actor: ${entry.actorType}:${entry.actorId} | psid: ${entry.resourceId}`,
        )
    }
}
