export interface ReminderJobData {
    subscriptionId: string
    clientId: string
    notifyAt: Date
}

export interface RetryPaymentJobData {
    subscriptionId: string
    clientId: string
    stripeSubscriptionId: string
    attemptNumber: number
}

export interface CancelJobData {
    subscriptionId: string
    clientId: string
    cancelAt: Date
}

export interface PauseJobData {
    subscriptionId: string
    clientId: string
    pauseUntil?: Date
}
