export type AuditActorType = 'client' | 'system' | 'admin'

export interface AuditLogEntry {
    action: string
    actorId: number
    actorType: AuditActorType
    resourceId: string
    meta?: Record<string, unknown>
}
