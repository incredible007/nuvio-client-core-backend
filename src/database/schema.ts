import {
    pgTable,
    integer,
    timestamp,
    varchar,
    boolean,
    index,
    bigint,
    jsonb,
    foreignKey,
    numeric,
    smallint,
    text,
    unique,
    doublePrecision,
    uniqueIndex,
    check,
    primaryKey,
    pgEnum,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const accountCurrencies = pgEnum('account_currencies', ['USD', 'EUR', 'CNY', 'GBP'])
export const adminNotificationVariants = pgEnum('admin_notification_variants', [
    'NEW_COMPLAINT',
    'NEW_REVIEW',
    'NEW_VENDOR_REGISTER',
    'NEW_REFUND',
    'NEW_NEGATIVE_REVIEW',
])
export const appTypes = pgEnum('app_types', ['IOS', 'ANDROID', 'ADMIN', 'WEB'])
export const auditActions = pgEnum('audit_actions', ['INSERT', 'UPDATE', 'DELETE'])
export const billingIntervals = pgEnum('billing_intervals', ['DAY', 'WEEK', 'MONTH', 'YEAR'])
export const complaintStateVariants = pgEnum('complaint_state_variants', [
    'DECLINED',
    'ACCEPTED',
    'IN_REVIEW',
])
export const dataTypeVariants = pgEnum('data_type_variants', ['TEXT', 'BOOL', 'NUMBER'])
export const discountVariants = pgEnum('discount_variants', ['PERCENT', 'FIX'])
export const languageVariants = pgEnum('language_variants', ['RU', 'EN', 'CH'])
export const managerTypes = pgEnum('manager_types', ['CONTENT_MANAGER', 'ADMIN'])
export const mediaTypes = pgEnum('media_types', ['VIDEO', 'IMAGE', 'FILE'])
export const messageVariants = pgEnum('message_variants', ['USER', 'SYSTEM'])
export const ordersStates = pgEnum('orders_states', [
    'CREATED',
    'PACKED',
    'DELIVERED',
    'SUCCEED',
    'CANCELED',
])
export const paymentMethods = pgEnum('payment_methods', ['CARD'])
export const permitDirectories = pgEnum('permit_directories', [
    'ORDERS',
    'DISCOUNTS',
    'FINANCES',
    'REFUNDS',
    'CATEGORIES',
    'REVIEWS',
])
export const permitLevels = pgEnum('permit_levels', ['READ', 'CREATE', 'UPDATE', 'DELETE'])
export const productComplaintVariants = pgEnum('product_complaint_variants', [
    'INCORRECT_PRICE',
    'INCORRECT_INFO',
    'VENDOR_NOT_ANSWER',
    'VIOLATES_TOS',
    'FRAUD',
    'OFFENSIVE_SPEAK',
    'FORBIDDEN_SUBSTANCES',
    'OTHER',
])
export const productCustomPropVariants = pgEnum('product_custom_prop_variants', ['BOOL'])
export const productRefundReasonVariants = pgEnum('product_refund_reason_variants', [
    'DEFECTIVE_PRODUCT',
    'OTHER',
])
export const productRefundStateVariants = pgEnum('product_refund_state_variants', [
    'PENDING',
    'REJECTED',
    'ACCEPTED',
    'CANCELLED',
])
export const productSubBillsStateVariants = pgEnum('product_sub_bills_state_variants', [
    'PENDING',
    'SUCCEED',
    'FAILURE',
])
export const productSubscriberStates = pgEnum('product_subscriber_states', [
    'ACTIVE',
    'CANCELLED',
    'AWAITING',
])
export const productVariants = pgEnum('product_variants', ['SUBSCRIPTION', 'ONE_TIME', 'GOOD'])
export const reviewStateVariants = pgEnum('review_state_variants', [
    'PENDING',
    'REJECTED',
    'PUBLISHED',
])
export const subscriptionReminderVariants = pgEnum('subscription_reminder_variants', [
    'BEFORE_7_DAYS',
    'BEFORE_1_DAY',
    'PAYMENT_FAILED',
    'CANCELLED_BY_FAILURE',
    'MANUAL_CANCEL',
    'PAYMENT_FAILED_RETRY',
    'PAYMENT_SUCCESS',
])
export const systemNotificationVariants = pgEnum('system_notification_variants', [
    'COMPLAINT_CREATED',
    'REVIEW_CREATED',
    'NEGATIVE_REVIEW_CREATED',
    'VENDOR_REGISTER',
    'PRODUCT_REFUND_CREATED',
])
export const transactionStatusVariants = pgEnum('transaction_status_variants', [
    'PENDING',
    'SUCCEED',
    'FAILURE',
])
export const userTypeVariants = pgEnum('user_type_variants', ['MANAGER', 'CLIENT', 'VENDOR'])
export const userTypes = pgEnum('user_types', ['MANAGER', 'CLIENT', 'COURIER'])
export const vendorAccountTransactionVariants = pgEnum('vendor_account_transaction_variants', [
    'PAYOUT',
    'ACCRUAL',
    'ADJUSTING',
])
export const vendorLegalFormVariants = pgEnum('vendor_legal_form_variants', [
    'COMPANY',
    'INDIVIDUAL',
    'SELF_EMPLOYED',
])
export const vendorPayoutRequestStateVariants = pgEnum('vendor_payout_request_state_variants', [
    'PENDING',
    'REJECTED',
    'SUCCEED',
    'CANCELLED',
])

export const appVersions = pgTable('app_versions', {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'app_versions_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    type: appTypes(),
    version: varchar({ length: 15 }),
    isMajor: boolean('is_major'),
    isProduction: boolean('is_production'),
    usersCount: integer('users_count').default(0),
})

export const auditLog = pgTable(
    'audit_log',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
            name: 'audit_log_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
        tableName: varchar('table_name', { length: 100 }).notNull(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        recordId: bigint('record_id', { mode: 'number' }).notNull(),
        action: auditActions().notNull(),
        oldData: jsonb('old_data'),
        newData: jsonb('new_data'),
        actorId: integer('actor_id'),
        actorType: userTypeVariants('actor_type'),
        ipAddress: varchar('ip_address', { length: 45 }),
    },
    (table) => [
        index('idx_audit_actor').using('btree', table.actorId.asc().nullsLast().op('int4_ops')),
        index('idx_audit_created_at').using(
            'btree',
            table.createdAt.asc().nullsLast().op('timestamp_ops'),
        ),
        index('idx_audit_record').using(
            'btree',
            table.tableName.asc().nullsLast().op('text_ops'),
            table.recordId.asc().nullsLast().op('text_ops'),
        ),
    ],
)

export const clientPayoutRequests = pgTable(
    'client_payout_requests',
    {
        cprid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'client_payout_requests_cprid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        payoutRequestStateVariant: vendorPayoutRequestStateVariants(
            'payout_request_state_variant',
        ).notNull(),
        cid: integer().notNull(),
        amount: numeric({ precision: 15, scale: 2 }).default('0').notNull(),
        cpr: integer().notNull(),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'client_payout_requests_cid_fkey',
        }),
        foreignKey({
            columns: [table.cpr],
            foreignColumns: [clientPayoutRequisites.cpr],
            name: 'client_payout_requests_cpr_fkey',
        }),
    ],
)

export const clientReferrals = pgTable(
    'client_referrals',
    {
        crid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'client_referrals_crid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        expiresAt: timestamp('expires_at', { mode: 'date' }),
        primaryRateVolume: smallint('primary_rate_volume').default(0).notNull(),
        personalRateVolume: smallint('personal_rate_volume').default(0).notNull(),
        ownerCid: integer('owner_cid').notNull(),
        reffererCid: integer('refferer_cid').notNull(),
        isOperational: boolean('is_operational').default(true),
    },
    (table) => [
        foreignKey({
            columns: [table.ownerCid],
            foreignColumns: [clients.cid],
            name: 'client_referrals_owner_cid_fkey',
        }),
        foreignKey({
            columns: [table.reffererCid],
            foreignColumns: [clients.cid],
            name: 'client_referrals_refferer_cid_fkey',
        }),
    ],
)

export const clientPayoutRequisites = pgTable(
    'client_payout_requisites',
    {
        cpr: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'client_payout_requisites_cpr_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        cid: integer().notNull(),
        bankName: varchar('bank_name', { length: 100 }),
        bankCode: varchar('bank_code', { length: 20 }),
        bankSwift: varchar('bank_swift', { length: 11 }),
        bankAddress: varchar('bank_address', { length: 200 }),
        bankAccountNumber: varchar('bank_account_number', { length: 100 }),
        bankAccountHolder: varchar('bank_account_holder', { length: 100 }),
        bankBik: varchar('bank_bik', { length: 9 }),
        bankInn: varchar('bank_inn', { length: 12 }),
        bankKorrNumber: varchar('bank_korr_number', { length: 17 }),
        comment: varchar({ length: 100 }),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'client_payout_requisites_cid_fkey',
        }),
    ],
)

export const clientReferralsAccountTransactions = pgTable(
    'client_referrals_account_transactions',
    {
        crid: integer(),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        totalAmount: numeric('total_amount', { precision: 15, scale: 2 }).default('0').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.crid],
            foreignColumns: [clientReferrals.crid],
            name: 'client_referrals_account_transactions_crid_fkey',
        }),
    ],
)

export const productRefunds = pgTable(
    'product_refunds',
    {
        prfid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_refunds_prfid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        cid: integer().notNull(),
        oid: integer(),
        pid: integer().notNull(),
        productRefundStateVariant: productRefundStateVariants(
            'product_refund_state_variant',
        ).default('PENDING'),
        comment: text(),
        reason: text(),
        productRefundReasonVariant: productRefundReasonVariants('product_refund_reason_variant'),
        refundProductCount: integer('refund_product_count'),
        isRefundComplete: boolean('is_refund_complete').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'product_refunds_cid_fkey',
        }),
        foreignKey({
            columns: [table.oid],
            foreignColumns: [orders.oid],
            name: 'product_refunds_oid_fkey',
        }),
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_refunds_pid_fkey',
        }),
    ],
)

export const bankCardTokens = pgTable(
    'bank_card_tokens',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'bank_card_tokens_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        expiresAt: timestamp('expires_at', { mode: 'date' }),
        token: varchar({ length: 200 }),
        caid: integer(),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.caid],
            foreignColumns: [clientAddresses.caid],
            name: 'bank_card_tokens_caid_fkey',
        }),
    ],
)

export const clients = pgTable(
    'clients',
    {
        cid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'clients_cid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        name: varchar({ length: 50 }),
        email: varchar({ length: 254 }).notNull(),
        phone: varchar({ length: 20 }),
        partnersCode: varchar('partners_code', { length: 100 }),
        isAllowMailing: boolean('is_allow_mailing'),
        firebasePushToken: varchar('firebase_push_token', { length: 1000 }),
        isPushEnabled: boolean('is_push_enabled'),
        isMailingEnabled: boolean('is_mailing_enabled'),
        allowOrderNotifications: boolean('allow_order_notifications').default(true),
        isBanned: boolean('is_banned').default(false),
        banReason: varchar('ban_reason', { length: 500 }),
        avatarId: integer('avatar_id'),
        isArchived: boolean('is_archived').default(false),
        stripeCustomerId: varchar('stripe_customer_id'),
    },
    (table) => [
        foreignKey({
            columns: [table.avatarId],
            foreignColumns: [media.mid],
            name: 'clients_avatar_id_fkey',
        }),
        unique('clients_email_key').on(table.email),
        unique('clients_phone_key').on(table.phone),
        unique('clients_partners_code_key').on(table.partnersCode),
        unique('clients_stripe_customer_id_key').on(table.stripeCustomerId),
    ],
)

export const vendorRequisites = pgTable(
    'vendor_requisites',
    {
        vrqid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_requisites_vrqid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        vid: integer().notNull(),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        name: varchar({ length: 200 }),
        fiscalNumber: varchar('fiscal_number', { length: 20 }).notNull(),
        taxId: varchar('tax_id', { length: 50 }).notNull(),
        contactForm: varchar('contact_form', { length: 20 }),
        contactEmail: varchar('contact_email', { length: 255 }),
        primaryPersonName: varchar('primary_person_name', { length: 100 }),
        accountantName: varchar('accountant_name', { length: 100 }),
        comment: varchar({ length: 1000 }),
        vendorLegalFormVariant: vendorLegalFormVariants('vendor_legal_form_variant').notNull(),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'vendor_requisites_vid_fkey',
        }),
        unique('vendor_requisites_fiscal_number_key').on(table.fiscalNumber),
        unique('vendor_requisites_tax_id_key').on(table.taxId),
    ],
)

export const vendorAccountTransactions = pgTable(
    'vendor_account_transactions',
    {
        vatid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_account_transactions_vatid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        vaid: integer().notNull(),
        totalAmount: numeric('total_amount', { precision: 15, scale: 2 }).default('0').notNull(),
        feeAmount: numeric('fee_amount', { precision: 15, scale: 2 }).default('0').notNull(),
        vendorAccountTransactionVariant: vendorAccountTransactionVariants(
            'vendor_account_transaction_variant',
        ).notNull(),
        transactionStatusVariant: transactionStatusVariants('transaction_status_variant').notNull(),
        version: integer().default(1).notNull(),
    },
    (table) => [
        index('idx_vat_account').using('btree', table.vaid.asc().nullsLast().op('int4_ops')),
        index('idx_vat_account_time').using(
            'btree',
            table.vaid.asc().nullsLast().op('int4_ops'),
            table.createdAt.asc().nullsLast().op('int4_ops'),
        ),
        foreignKey({
            columns: [table.vaid],
            foreignColumns: [vendorAccounts.vaid],
            name: 'vendor_account_transactions_vaid_fkey',
        }),
    ],
)

export const vendorPayoutRequests = pgTable(
    'vendor_payout_requests',
    {
        vprid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_payout_requests_vprid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        vaid: integer().notNull(),
        totalAmount: numeric('total_amount', { precision: 15, scale: 2 }).default('0').notNull(),
        vbrid: integer(),
        vendorPayoutRequestStateVariant: vendorPayoutRequestStateVariants(
            'vendor_payout_request_state_variant',
        ).default('PENDING'),
    },
    (table) => [
        foreignKey({
            columns: [table.vaid],
            foreignColumns: [vendorAccounts.vaid],
            name: 'vendor_payout_requests_vaid_fkey',
        }),
        foreignKey({
            columns: [table.vbrid],
            foreignColumns: [vendorBankRequisites.vbrid],
            name: 'vendor_payout_requests_vbrid_fkey',
        }),
    ],
)

export const confirmationSmsCodes = pgTable('confirmation_sms_codes', {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
        name: 'confirmation_sms_codes_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    phone: varchar({ length: 20 }).notNull(),
    codeHash: varchar('code_hash', { length: 1000 }).notNull(),
})

export const clientAddresses = pgTable(
    'client_addresses',
    {
        caid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'client_addresses_caid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        clientId: integer('client_id'),
        lat: doublePrecision(),
        lng: doublePrecision(),
        city: varchar({ length: 100 }),
        street: varchar({ length: 100 }),
        houseNum: smallint('house_num'),
        flatNum: integer('flat_num'),
        stage: integer(),
        entrance: integer(),
        comment: varchar({ length: 1000 }),
        transportCompany: integer('transport_company'),
        isPrimary: boolean('is_primary'),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.clientId],
            foreignColumns: [clients.cid],
            name: 'client_addresses_client_id_fkey',
        }),
        foreignKey({
            columns: [table.transportCompany],
            foreignColumns: [dTransportCompanies.id],
            name: 'client_addresses_transport_company_fkey',
        }),
    ],
)

export const media = pgTable(
    'media',
    {
        mid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'media_mid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        description: varchar({ length: 500 }),
        path: varchar({ length: 1000 }).notNull(),
        mediaType: mediaTypes('media_type'),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [unique('media_path_key').on(table.path)],
)

export const vendorPhoneAuth = pgTable(
    'vendor_phone_auth',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_phone_auth_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        phone: varchar({ length: 20 }).notNull(),
        vendorId: integer('vendor_id'),
    },
    (table) => [
        foreignKey({
            columns: [table.vendorId],
            foreignColumns: [vendors.vid],
            name: 'vendor_phone_auth_vendor_id_fkey',
        }),
        unique('vendor_phone_auth_phone_key').on(table.phone),
    ],
)

export const clientsPhoneAuth = pgTable(
    'clients_phone_auth',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'clients_phone_auth_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        phone: varchar({ length: 20 }).notNull(),
        clientId: integer('client_id'),
    },
    (table) => [
        foreignKey({
            columns: [table.clientId],
            foreignColumns: [clients.cid],
            name: 'clients_phone_auth_client_id_fkey',
        }),
        unique('clients_phone_auth_phone_key').on(table.phone),
    ],
)

export const managers = pgTable(
    'managers',
    {
        maid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'managers_maid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        managerType: managerTypes('manager_type'),
        name: varchar({ length: 250 }),
        login: varchar({ length: 255 }).notNull(),
        email: varchar({ length: 255 }),
        isBanned: boolean('is_banned').default(false),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        unique('managers_login_key').on(table.login),
        unique('managers_email_key').on(table.email),
    ],
)

export const managerPasswordAuth = pgTable(
    'manager_password_auth',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'manager_password_auth_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        login: varchar({ length: 255 }).notNull(),
        passwordSha256: varchar('password_sha256', { length: 1000 }),
        managerId: integer('manager_id'),
    },
    (table) => [
        foreignKey({
            columns: [table.managerId],
            foreignColumns: [managers.maid],
            name: 'manager_password_auth_manager_id_fkey',
        }),
        unique('manager_password_auth_login_key').on(table.login),
    ],
)

export const products = pgTable(
    'products',
    {
        pid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'products_pid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        productSlug: varchar('product_slug', { length: 500 }).notNull(),
        articleNumber: varchar('article_number', { length: 50 }),
        vendorOwnerId: integer('vendor_owner_id'),
        baseVolume: doublePrecision('base_volume'),
        volumeDimension: varchar('volume_dimension', { length: 10 }),
        pcid: integer(),
        length: doublePrecision(),
        width: doublePrecision(),
        height: doublePrecision(),
        weight: doublePrecision(),
        colorHex: varchar('color_hex', { length: 50 }),
        packageSize: varchar('package_size', { length: 10 }),
        countryId: integer('country_id'),
        brandId: integer('brand_id'),
        productVariant: productVariants('product_variant').default('GOOD').notNull(),
        isArchived: boolean('is_archived').default(false),
        isVisible: boolean('is_visible').default(true),
    },
    (table) => [
        index('idx_products_brand').using('btree', table.brandId.asc().nullsLast().op('int4_ops')),
        index('idx_products_category').using('btree', table.pcid.asc().nullsLast().op('int4_ops')),
        index('idx_products_category_vendor').using(
            'btree',
            table.pcid.asc().nullsLast().op('int4_ops'),
            table.vendorOwnerId.asc().nullsLast().op('int4_ops'),
        ),
        index('idx_products_country').using(
            'btree',
            table.countryId.asc().nullsLast().op('int4_ops'),
        ),
        index('idx_products_vendor_id').using(
            'btree',
            table.vendorOwnerId.asc().nullsLast().op('int4_ops'),
        ),
        foreignKey({
            columns: [table.vendorOwnerId],
            foreignColumns: [vendors.vid],
            name: 'products_vendor_owner_id_fkey',
        }),
        foreignKey({
            columns: [table.pcid],
            foreignColumns: [productCategories.pcid],
            name: 'products_pcid_fkey',
        }),
        foreignKey({
            columns: [table.countryId],
            foreignColumns: [dCountries.id],
            name: 'products_country_id_fkey',
        }),
        foreignKey({
            columns: [table.brandId],
            foreignColumns: [dBrands.id],
            name: 'products_brand_id_fkey',
        }),
        unique('products_product_slug_key').on(table.productSlug),
        unique('products_article_number_key').on(table.articleNumber),
    ],
)

export const productReviews = pgTable(
    'product_reviews',
    {
        prid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_reviews_prid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        cid: integer(),
        pid: integer().notNull(),
        text: text(),
        rateVolume: smallint('rate_volume').notNull(),
        isArchived: boolean('is_archived').default(false),
        isVisible: boolean('is_visible').default(true),
        vendorAnswer: text('vendor_answer'),
        vendorAnswerUpdatedAt: timestamp('vendor_answer_updated_at', { mode: 'date' }),
        reviewStateVariant: reviewStateVariants('review_state_variant').default('PENDING'),
    },
    (table) => [
        index('idx_reviews_product').using('btree', table.pid.asc().nullsLast().op('int4_ops')),
        index('idx_reviews_state').using(
            'btree',
            table.reviewStateVariant.asc().nullsLast().op('enum_ops'),
        ),
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'product_reviews_cid_fkey',
        }),
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_reviews_pid_fkey',
        }),
    ],
)

export const clientReviews = pgTable(
    'client_reviews',
    {
        crid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'client_reviews_crid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        toCid: integer('to_cid'),
        fromVid: integer('from_vid'),
        text: text(),
        rateVolume: smallint('rate_volume').notNull(),
        isArchived: boolean('is_archived').default(false),
        isVisible: boolean('is_visible').default(true),
        reviewStateVariant: reviewStateVariants('review_state_variant').default('PENDING'),
    },
    (table) => [
        foreignKey({
            columns: [table.toCid],
            foreignColumns: [clients.cid],
            name: 'client_reviews_to_cid_fkey',
        }),
        foreignKey({
            columns: [table.fromVid],
            foreignColumns: [vendors.vid],
            name: 'client_reviews_from_vid_fkey',
        }),
    ],
)

export const productCategories = pgTable(
    'product_categories',
    {
        pcid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_categories_pcid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        parentCategoryId: integer('parent_category_id'),
        isArchived: boolean('is_archived').default(false),
        isVisible: boolean('is_visible').default(true),
        categorySlug: varchar('category_slug', { length: 300 }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.parentCategoryId],
            foreignColumns: [table.pcid],
            name: 'product_categories_parent_category_id_fkey',
        }),
        unique('product_categories_category_slug_key').on(table.categorySlug),
    ],
)

export const orders = pgTable(
    'orders',
    {
        oid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'orders_oid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        clientId: integer('client_id'),
        totalAmount: numeric('total_amount', { precision: 15, scale: 2 }),
        orderState: ordersStates('order_state'),
        packages: integer(),
        weightKg: doublePrecision('weight_kg'),
        clientAddressId: integer('client_address_id'),
        cpmid: integer(),
        comment: varchar({ length: 1000 }),
        isArchived: boolean('is_archived').default(false),
        deliveryTrackNum: varchar('delivery_track_num', { length: 30 }),
        version: integer().default(1).notNull(),
    },
    (table) => [
        index('idx_orders_client').using('btree', table.clientId.asc().nullsLast().op('int4_ops')),
        index('idx_orders_client_state').using(
            'btree',
            table.clientId.asc().nullsLast().op('int4_ops'),
            table.orderState.asc().nullsLast().op('int4_ops'),
        ),
        index('idx_orders_state').using('btree', table.orderState.asc().nullsLast().op('enum_ops')),
        foreignKey({
            columns: [table.clientId],
            foreignColumns: [clients.cid],
            name: 'orders_client_id_fkey',
        }),
        foreignKey({
            columns: [table.clientAddressId],
            foreignColumns: [clientAddresses.caid],
            name: 'orders_client_address_id_fkey',
        }),
        foreignKey({
            columns: [table.cpmid],
            foreignColumns: [clientPaymentMethods.cpmid],
            name: 'orders_cpmid_fkey',
        }),
    ],
)

export const globalDiscounts = pgTable('global_discounts', {
    gdid: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'global_discounts_gdid_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    startsAt: timestamp('starts_at', { mode: 'date' }),
    expiresAt: timestamp('expires_at', { mode: 'date' }),
    discountAmount: numeric('discount_amount', { precision: 15, scale: 2 }),
    discountVariant: discountVariants('discount_variant'),
    minOrderAmount: integer('min_order_amount'),
    name: varchar({ length: 200 }),
    description: varchar({ length: 2000 }),
    isArchived: boolean('is_archived').default(false),
    isDraft: boolean('is_draft').default(true),
})

export const localDiscounts = pgTable(
    'local_discounts',
    {
        ldid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'local_discounts_ldid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        startsAt: timestamp('starts_at', { mode: 'date' }),
        expiresAt: timestamp('expires_at', { mode: 'date' }),
        discountAmount: numeric('discount_amount', { precision: 15, scale: 2 }),
        discountVariant: discountVariants('discount_variant'),
        minOrderAmount: numeric('min_order_amount', { precision: 15, scale: 2 }),
        name: varchar({ length: 200 }),
        description: varchar({ length: 2000 }),
        vid: integer(),
        isArchived: boolean('is_archived').default(false),
        isDraft: boolean('is_draft').default(true),
        isPending: boolean('is_pending').default(false).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'local_discounts_vid_fkey',
        }),
    ],
)

export const orderToProducts = pgTable(
    'order_to_products',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'order_to_products_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        productId: integer('product_id'),
        orderId: integer('order_id'),
        volume: integer(),
    },
    (table) => [
        index('idx_otp_order_id').using('btree', table.orderId.asc().nullsLast().op('int4_ops')),
        index('idx_otp_product_id').using(
            'btree',
            table.productId.asc().nullsLast().op('int4_ops'),
        ),
        foreignKey({
            columns: [table.productId],
            foreignColumns: [products.pid],
            name: 'order_to_products_product_id_fkey',
        }),
        foreignKey({
            columns: [table.orderId],
            foreignColumns: [orders.oid],
            name: 'order_to_products_order_id_fkey',
        }),
    ],
)

export const recommendedProducts = pgTable(
    'recommended_products',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'recommended_products_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        productId: integer('product_id'),
        recommendedGoodId: integer('recommended_good_id'),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.productId],
            foreignColumns: [products.pid],
            name: 'recommended_products_product_id_fkey',
        }),
        foreignKey({
            columns: [table.recommendedGoodId],
            foreignColumns: [products.pid],
            name: 'recommended_products_recommended_good_id_fkey',
        }),
    ],
)

export const productComplaints = pgTable(
    'product_complaints',
    {
        psid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_complaints_psid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        cid: integer().notNull(),
        text: text(),
        pid: integer().notNull(),
        complaintVariant: productComplaintVariants('complaint_variant').notNull(),
        complaintStateVariant: complaintStateVariants('complaint_state_variant')
            .default('IN_REVIEW')
            .notNull(),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'product_complaints_cid_fkey',
        }),
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_complaints_pid_fkey',
        }),
    ],
)

export const articlePublications = pgTable('article_publications', {
    apid: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'article_publications_apid_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    isPublished: boolean('is_published').default(true),
    isArchived: boolean('is_archived').default(false),
    slug: varchar({ length: 300 }),
})

export const adminNotifications = pgTable(
    'admin_notifications',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        anid: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
            name: 'admin_notifications_anid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        sentAt: timestamp('sent_at', { mode: 'date' }),
        adminNotificationVariant: adminNotificationVariants('admin_notification_variant').notNull(),
        title: varchar({ length: 200 }),
        cid: integer(),
        pid: integer(),
        prid: integer(),
        pcid: integer(),
        vid: integer(),
        prfid: integer(),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'admin_notifications_cid_fkey',
        }),
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'admin_notifications_pid_fkey',
        }),
        foreignKey({
            columns: [table.prid],
            foreignColumns: [productReviews.prid],
            name: 'admin_notifications_prid_fkey',
        }),
        foreignKey({
            columns: [table.pcid],
            foreignColumns: [productComplaints.psid],
            name: 'admin_notifications_pcid_fkey',
        }),
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'admin_notifications_vid_fkey',
        }),
        foreignKey({
            columns: [table.prfid],
            foreignColumns: [productRefunds.prfid],
            name: 'admin_notifications_prfid_fkey',
        }),
    ],
)

export const authSessions = pgTable(
    'auth_sessions',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        asid: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
            name: 'auth_sessions_asid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        clientId: integer('client_id'),
        managerId: integer('manager_id'),
        vendorId: integer('vendor_id'),
        type: userTypeVariants(),
        refreshToken: varchar('refresh_token', { length: 2000 }).notNull(),
        isActive: boolean('is_active').default(true),
        lastIpAddress: varchar('last_ip_address', { length: 30 }),
        lastRefreshTokenTime: timestamp('last_refresh_token_time', { mode: 'date' }),
    },
    (table) => [
        foreignKey({
            columns: [table.clientId],
            foreignColumns: [clients.cid],
            name: 'auth_sessions_client_id_fkey',
        }),
        foreignKey({
            columns: [table.managerId],
            foreignColumns: [managers.maid],
            name: 'auth_sessions_manager_id_fkey',
        }),
        foreignKey({
            columns: [table.vendorId],
            foreignColumns: [vendors.vid],
            name: 'auth_sessions_vendor_id_fkey',
        }),
    ],
)

export const vendorComplaints = pgTable(
    'vendor_complaints',
    {
        vcid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_complaints_vcid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        cid: integer().notNull(),
        text: text(),
        vid: integer().notNull(),
        complaintVariant: productComplaintVariants('complaint_variant').notNull(),
        complaintStateVariant: complaintStateVariants('complaint_state_variant')
            .default('IN_REVIEW')
            .notNull(),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'vendor_complaints_cid_fkey',
        }),
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'vendor_complaints_vid_fkey',
        }),
    ],
)

export const userGeolocations = pgTable(
    'user_geolocations',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        uglid: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
            name: 'user_geolocations_uglid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
        cid: integer().notNull(),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        lat: doublePrecision().notNull(),
        lng: doublePrecision().notNull(),
        accuracy: smallint(),
    },
    (table) => [
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'user_geolocations_cid_fkey',
        }),
    ],
)

export const newsPublications = pgTable('news_publications', {
    npid: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'news_publications_npid_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    isPublished: boolean('is_published').default(true),
    isArchived: boolean('is_archived').default(false),
    slug: varchar({ length: 300 }),
})

export const conversations = pgTable(
    'conversations',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        convid: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
            name: 'conversations_convid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        pid: integer(),
        oid: integer(),
        avatarMid: integer('avatar_mid'),
        lastMessageText: varchar('last_message_text', { length: 200 }),
        lastMessageAt: timestamp('last_message_at', { mode: 'date' }),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'conversations_pid_fkey',
        }),
        foreignKey({
            columns: [table.oid],
            foreignColumns: [orders.oid],
            name: 'conversations_oid_fkey',
        }),
        foreignKey({
            columns: [table.avatarMid],
            foreignColumns: [media.mid],
            name: 'conversations_avatar_mid_fkey',
        }),
    ],
)

export const productCategoryProps = pgTable(
    'product_category_props',
    {
        pcpid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_category_props_pcpid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        pcid: integer(),
        code: varchar({ length: 20 }),
        order: smallint(),
        dataTypeVariant: dataTypeVariants('data_type_variant').notNull(),
        isArchived: boolean('is_archived').default(false),
        isRequired: boolean('is_required').default(false),
        isVisible: boolean('is_visible').default(false),
        isFiltering: boolean('is_filtering'),
    },
    (table) => [
        foreignKey({
            columns: [table.pcid],
            foreignColumns: [productCategories.pcid],
            name: 'product_category_props_pcid_fkey',
        }),
    ],
)

export const integrationSpecs = pgTable('integration_specs', {
    isid: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'integration_specs_isid_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    serviceName: varchar('service_name', { length: 100 }),
    serviceDescription: varchar('service_description', { length: 100 }),
    apiKey: varchar('api_key', { length: 1000 }),
})

export const dCountries = pgTable('d_countries', {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'd_countries_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    isArchived: boolean('is_archived').default(false),
})

export const dBrands = pgTable('d_brands', {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'd_brands_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    isArchived: boolean('is_archived').default(false),
})

export const convParticipants = pgTable(
    'conv_participants',
    {
        convpid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'conv_participants_convpid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        convid: bigint({ mode: 'number' }).notNull(),
        vid: integer(),
        cid: integer(),
        maid: integer(),
        lastReadMesid: integer('last_read_mesid'),
    },
    (table) => [
        foreignKey({
            columns: [table.convid],
            foreignColumns: [conversations.convid],
            name: 'conv_participants_convid_fkey',
        }),
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'conv_participants_vid_fkey',
        }),
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'conv_participants_cid_fkey',
        }),
        foreignKey({
            columns: [table.maid],
            foreignColumns: [managers.maid],
            name: 'conv_participants_maid_fkey',
        }),
        foreignKey({
            columns: [table.lastReadMesid],
            foreignColumns: [convMessages.mesid],
            name: 'conv_participants_last_read_mesid_fkey',
        }),
    ],
)

export const convMessages = pgTable(
    'conv_messages',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        mesid: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
            name: 'conv_messages_mesid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        archivedAt: timestamp('archived_at', { mode: 'date' }),
        text: text(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        convid: bigint({ mode: 'number' }).notNull(),
        vid: integer(),
        cid: integer(),
        maid: integer(),
        messageVariant: messageVariants('message_variant'),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        index('idx_messages_convid').using('btree', table.convid.asc().nullsLast().op('int8_ops')),
        index('idx_messages_convid_time').using(
            'btree',
            table.convid.asc().nullsLast().op('int8_ops'),
            table.createdAt.asc().nullsLast().op('int8_ops'),
        ),
        foreignKey({
            columns: [table.convid],
            foreignColumns: [conversations.convid],
            name: 'conv_messages_convid_fkey',
        }),
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'conv_messages_vid_fkey',
        }),
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'conv_messages_cid_fkey',
        }),
        foreignKey({
            columns: [table.maid],
            foreignColumns: [managers.maid],
            name: 'conv_messages_maid_fkey',
        }),
    ],
)

export const accessPermits = pgTable('access_permits', {
    apid: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'access_permits_apid_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    name: varchar({ length: 200 }),
    permitLevel: permitLevels('permit_level').array(),
    permitDirectories: permitDirectories('permit_directories').array(),
    isArchived: boolean('is_archived').default(false),
})

export const dCustom = pgTable('d_custom', {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'd_custom_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }),
    isArchived: boolean('is_archived').default(false),
})

export const managerNotifications = pgTable(
    'manager_notifications',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        notificationId: bigint('notification_id', { mode: 'number' }).notNull(),
        readAt: timestamp('read_at', { mode: 'date' }),
        managerId: integer('manager_id').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.notificationId],
            foreignColumns: [systemNotifications.id],
            name: 'manager_notifications_notification_id_fkey',
        }),
        foreignKey({
            columns: [table.managerId],
            foreignColumns: [managers.maid],
            name: 'manager_notifications_manager_id_fkey',
        }),
    ],
)

export const vendorBankRequisites = pgTable(
    'vendor_bank_requisites',
    {
        vbrid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_bank_requisites_vbrid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        vid: integer().notNull(),
        vrqid: integer(),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        bankName: varchar('bank_name', { length: 50 }),
        bankCode: varchar('bank_code', { length: 10 }),
        bankSwift: varchar('bank_swift', { length: 11 }),
        bankAddress: varchar('bank_address', { length: 200 }),
        bankAccountNumber: varchar('bank_account_number', { length: 20 }),
        bankAccountHolder: varchar('bank_account_holder', { length: 50 }),
        bankBik: varchar('bank_bik', { length: 9 }),
        bankInn: varchar('bank_inn', { length: 17 }),
        bankKorrNumber: varchar('bank_korr_number', { length: 20 }),
        comment: varchar({ length: 1000 }),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'vendor_bank_requisites_vid_fkey',
        }),
        foreignKey({
            columns: [table.vrqid],
            foreignColumns: [vendorRequisites.vrqid],
            name: 'vendor_bank_requisites_vrqid_fkey',
        }),
    ],
)

export const vendorAccounts = pgTable(
    'vendor_accounts',
    {
        vaid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_accounts_vaid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        vid: integer().notNull(),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        startedAt: timestamp('started_at', { mode: 'date' }),
        suspendedAt: timestamp('suspended_at', { mode: 'date' }),
        accountCurrency: accountCurrencies('account_currency').notNull(),
        feeDefault: numeric('fee_default', { precision: 15, scale: 2 }).default('0'),
        isArchived: boolean('is_archived').default(false),
        isSuspended: boolean('is_suspended').default(false),
        isVerified: boolean('is_verified').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'vendor_accounts_vid_fkey',
        }),
    ],
)

export const dTransportCompanies = pgTable('d_transport_companies', {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
        name: 'd_transport_companies_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    isArchived: boolean('is_archived').default(false),
})

export const productCustomProps = pgTable(
    'product_custom_props',
    {
        pcpid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_custom_props_pcpid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        value: jsonb().notNull(),
        isArchived: boolean('is_archived').default(false),
        isVisible: boolean('is_visible').default(true),
    },
    (table) => [
        index('idx_custom_props_value').using('gin', table.value.asc().nullsLast().op('jsonb_ops')),
    ],
)

export const vendorReviews = pgTable(
    'vendor_reviews',
    {
        vrid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendor_reviews_vrid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        toVid: integer('to_vid'),
        fromCid: integer('from_cid'),
        text: text(),
        rateVolume: smallint('rate_volume').notNull(),
        isVisible: boolean('is_visible').default(true),
        reviewStateVariant: reviewStateVariants('review_state_variant').default('PENDING'),
        isArchived: boolean('is_archived').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.toVid],
            foreignColumns: [vendors.vid],
            name: 'vendor_reviews_to_vid_fkey',
        }),
        foreignKey({
            columns: [table.fromCid],
            foreignColumns: [clients.cid],
            name: 'vendor_reviews_from_cid_fkey',
        }),
    ],
)

export const systemNotifications = pgTable(
    'system_notifications',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
            name: 'system_notifications_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
        systemNotificationVariant: systemNotificationVariants(
            'system_notification_variant',
        ).notNull(),
        title: varchar({ length: 100 }),
        topic: varchar({ length: 50 }),
        description: varchar({ length: 1000 }),
        vid: integer(),
        prid: integer(),
        complaintId: integer('complaint_id'),
        prfid: integer(),
    },
    (table) => [
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'system_notifications_vid_fkey',
        }),
        foreignKey({
            columns: [table.prid],
            foreignColumns: [productReviews.prid],
            name: 'system_notifications_prid_fkey',
        }),
        foreignKey({
            columns: [table.complaintId],
            foreignColumns: [productComplaints.psid],
            name: 'system_notifications_complaint_id_fkey',
        }),
        foreignKey({
            columns: [table.prfid],
            foreignColumns: [productRefunds.prfid],
            name: 'system_notifications_prfid_fkey',
        }),
    ],
)

export const productPrices = pgTable(
    'product_prices',
    {
        ppid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_prices_ppid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        pid: integer().notNull(),
        price: numeric({ precision: 15, scale: 2 }).notNull(),
        duration: doublePrecision(),
        description: varchar({ length: 300 }),
        countryId: integer('country_id').notNull(),
        isArchived: boolean('is_archived').default(false),
        stripePriceId: varchar('stripe_price_id').notNull(),
        stripeProductId: varchar('stripe_product_id').notNull(),
        currency: accountCurrencies().notNull(),
        billingInterval: billingIntervals('billing_interval'),
        billingIntervalCount: integer('billing_interval_count'),
    },
    (table) => [
        index('idx_product_prices_country_id_pid_interval_count').using(
            'btree',
            table.countryId.asc().nullsLast().op('int4_ops'),
            table.pid.asc().nullsLast().op('enum_ops'),
            table.billingInterval.asc().nullsLast().op('int4_ops'),
            table.billingIntervalCount.asc().nullsLast().op('int4_ops'),
        ),
        uniqueIndex('product_prices_country_id_pid_duration_idx').using(
            'btree',
            table.countryId.asc().nullsLast().op('int4_ops'),
            table.pid.asc().nullsLast().op('int4_ops'),
            table.duration.asc().nullsLast().op('float8_ops'),
        ),
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_prices_pid_fkey',
        }),
        foreignKey({
            columns: [table.countryId],
            foreignColumns: [dCountries.id],
            name: 'product_prices_country_id_fkey',
        }),
        unique('product_prices_stripe_price_id_key').on(table.stripePriceId),
        unique('product_prices_stripe_product_id_key').on(table.stripeProductId),
        check('chk_product_prices_price_positive', sql`price > (0)::numeric`),
        check(
            'chk_product_prices_billing_interval_count_range',
            sql`(billing_interval_count >= 1) AND (billing_interval_count <= 365)`,
        ),
    ],
)

export const idempotencyKeys = pgTable(
    'idempotency_keys',
    {
        key: text().primaryKey().notNull(),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
        result: jsonb().notNull(),
        scope: varchar().notNull(),
        status: varchar().notNull(),
    },
    (table) => [
        index('idx_ik_expires_at').using(
            'btree',
            table.expiresAt.asc().nullsLast().op('timestamp_ops'),
        ),
        index('idx_ik_scope').using('btree', table.scope.asc().nullsLast().op('text_ops')),
    ],
)

export const subscriptionRefunds = pgTable(
    'subscription_refunds',
    {
        srid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'subscription_refunds_srid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        psbid: integer().notNull(),
        psid: integer().notNull(),
        stripeRefundId: varchar('stripe_refund_id').notNull(),
        amount: numeric({ precision: 15, scale: 2 }).notNull(),
        currency: accountCurrencies().notNull(),
        reason: varchar().notNull(),
        status: transactionStatusVariants().notNull(),
    },
    (table) => [
        index('idx_subscription_refunds_psbid').using(
            'btree',
            table.psbid.asc().nullsLast().op('int4_ops'),
        ),
        foreignKey({
            columns: [table.psbid],
            foreignColumns: [productSubBills.psbid],
            name: 'subscription_refunds_psbid_fkey',
        }),
        foreignKey({
            columns: [table.psid],
            foreignColumns: [productSubscribers.psid],
            name: 'subscription_refunds_psid_fkey',
        }),
        unique('subscription_refunds_stripe_refund_id_key').on(table.stripeRefundId),
        check('chk_subscription_refunds_amount_positive', sql`amount > (0)::numeric`),
    ],
)

export const subscriptionAuditLogs = pgTable(
    'subscription_audit_logs',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'subscription_audit_logs_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        psid: integer().notNull(),
        action: varchar().notNull(),
        actorId: integer('actor_id'),
        actorType: varchar('actor_type').notNull(),
        metadata: jsonb(),
    },
    (table) => [
        index('idx_subscription_audit_logs_psid_created_at').using(
            'btree',
            table.psid.asc().nullsLast().op('int4_ops'),
            table.createdAt.asc().nullsLast().op('int4_ops'),
        ),
        foreignKey({
            columns: [table.psid],
            foreignColumns: [productSubscribers.psid],
            name: 'subscription_audit_logs_psid_fkey',
        }),
    ],
)

export const subscriptionReminders = pgTable(
    'subscription_reminders',
    {
        subrid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'subscription_reminders_subrid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        sentAt: timestamp('sent_at', { mode: 'date' }),
        psid: integer().notNull(),
        psbid: integer(),
        variant: subscriptionReminderVariants().notNull(),
        channel: varchar().notNull(),
    },
    (table) => [
        index('idx_subscription_reminders_psid_variant_created_at').using(
            'btree',
            table.psid.asc().nullsLast().op('enum_ops'),
            table.variant.asc().nullsLast().op('int4_ops'),
            table.createdAt.asc().nullsLast().op('enum_ops'),
        ),
        foreignKey({
            columns: [table.psid],
            foreignColumns: [productSubscribers.psid],
            name: 'subscription_reminders_psid_fkey',
        }),
        foreignKey({
            columns: [table.psbid],
            foreignColumns: [productSubBills.psbid],
            name: 'subscription_reminders_psbid_fkey',
        }),
    ],
)

export const productSubscribers = pgTable(
    'product_subscribers',
    {
        psid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_subscribers_psid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        pid: integer().notNull(),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        cancelledAt: timestamp('cancelled_at', { mode: 'date' }),
        nextPaymentAt: timestamp('next_payment_at', { mode: 'date' }),
        cid: integer().notNull(),
        productPrice: integer('product_price').notNull(),
        productSubscriberState: productSubscriberStates('product_subscriber_state').default(
            'AWAITING',
        ),
        stripeSubscriptionId: varchar('stripe_subscription_id'),
        stripeCustomerId: varchar('stripe_customer_id'),
        failedPaymentAttempts: integer('failed_payment_attempts').default(0),
        pausedAt: timestamp('paused_at', { withTimezone: true, mode: 'string' }),
        resumeAt: timestamp('resume_at', { withTimezone: true, mode: 'string' }),
    },
    (table) => [
        index('idx_product_subscribers_next_payment_at').using(
            'btree',
            table.nextPaymentAt.asc().nullsLast().op('timestamp_ops'),
        ),
        index('idx_product_subscribers_stripe_customer_id').using(
            'btree',
            table.stripeCustomerId.asc().nullsLast().op('text_ops'),
        ),
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_subscribers_pid_fkey',
        }),
        foreignKey({
            columns: [table.cid],
            foreignColumns: [clients.cid],
            name: 'product_subscribers_cid_fkey',
        }),
        foreignKey({
            columns: [table.productPrice],
            foreignColumns: [productPrices.ppid],
            name: 'product_subscribers_product_price_fkey',
        }),
        unique('product_subscribers_stripe_subscription_id_key').on(table.stripeSubscriptionId),
        check('chk_product_subscribers_attempts_positive', sql`failed_payment_attempts >= 0`),
    ],
)

export const productSubBills = pgTable(
    'product_sub_bills',
    {
        psbid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'product_sub_bills_psbid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        psid: integer().notNull(),
        total: numeric({ precision: 15, scale: 2 }).notNull(),
        productSubBillsStateVariant: productSubBillsStateVariants('product_sub_bills_state_variant')
            .default('PENDING')
            .notNull(),
        stripeInvoiceId: varchar('stripe_invoice_id'),
        stripePaymentIntentId: varchar('stripe_payment_intent_id'),
        idempotencyKey: varchar('idempotency_key', { length: 64 }),
        attemptNumber: integer('attempt_number').default(1),
        nextRetryAt: timestamp('next_retry_at', { withTimezone: true, mode: 'string' }),
        paidAt: timestamp('paid_at', { withTimezone: true, mode: 'string' }),
        currency: accountCurrencies().notNull(),
    },
    (table) => [
        index('idx_psb_subscriber').using('btree', table.psid.asc().nullsLast().op('int4_ops')),
        foreignKey({
            columns: [table.psid],
            foreignColumns: [productSubscribers.psid],
            name: 'product_sub_bills_psid_fkey',
        }),
        unique('product_sub_bills_stripe_invoice_id_key').on(table.stripeInvoiceId),
        unique('product_sub_bills_stripe_payment_intent_id_key').on(table.stripePaymentIntentId),
        unique('product_sub_bills_idempotency_key_key').on(table.idempotencyKey),
        check('chk_product_sub_bills_attempt_positive', sql`attempt_number > 0`),
        check('chk_product_sub_total_positive', sql`total > (0)::numeric`),
    ],
)

export const clientPaymentMethods = pgTable(
    'client_payment_methods',
    {
        cpmid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'client_payment_methods_cpmid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        clientId: integer('client_id').notNull(),
        type: paymentMethods(),
        credentials: varchar({ length: 1000 }),
        description: varchar({ length: 2000 }),
        isArchived: boolean('is_archived').default(false),
        stripePmId: varchar('stripe_pm_id'),
        cardBrand: varchar('card_brand', { length: 20 }),
        cardLast4: varchar('card_last4', { length: 4 }),
        cardExpMonth: smallint('card_exp_month'),
        cardExpYear: smallint('card_exp_year'),
        isDefault: boolean('is_default').default(false),
    },
    (table) => [
        index('idx_client_payment_methods_client_id').using(
            'btree',
            table.clientId.asc().nullsLast().op('int4_ops'),
        ),
        uniqueIndex('ux_client_payment_methods_default_per_client')
            .using(
                'btree',
                table.clientId.asc().nullsLast().op('int4_ops'),
                table.isDefault.asc().nullsLast().op('bool_ops'),
            )
            .where(sql`((is_default = true) AND (is_archived = false))`),
        foreignKey({
            columns: [table.clientId],
            foreignColumns: [clients.cid],
            name: 'client_payment_methods_client_id_fkey',
        }),
        unique('client_payment_methods_stripe_pm_id_key').on(table.stripePmId),
        check(
            'chk_cp_methods_exp_month_range',
            sql`(card_exp_month >= 1) AND (card_exp_month <= 12)`,
        ),
        check('chk_cp_methods_more_2024', sql`card_exp_year >= 2024`),
        check('chk_cp_methods_card_last4_valid', sql`(card_last4)::text ~ '^[0-9]{4}$'::text`),
    ],
)

export const vendors = pgTable(
    'vendors',
    {
        vid: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'vendors_vid_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        name: varchar({ length: 100 }),
        email: varchar({ length: 255 }),
        phone: varchar({ length: 20 }),
        isAllowMailing: boolean('is_allow_mailing'),
        firebasePushToken: varchar('firebase_push_token', { length: 1000 }),
        isPushEnabled: boolean('is_push_enabled'),
        isMailingEnabled: boolean('is_mailing_enabled'),
        isBanned: boolean('is_banned').default(false),
        banReason: varchar('ban_reason', { length: 200 }),
        avatarId: integer('avatar_id'),
        isArchived: boolean('is_archived').default(false),
        stripeAccountId: varchar('stripe_account_id'),
        stripeChargesEnabled: boolean('stripe_charges_enabled').default(false),
        stripePayoutsEnabled: boolean('stripe_payouts_enabled').default(false),
    },
    (table) => [
        foreignKey({
            columns: [table.avatarId],
            foreignColumns: [media.mid],
            name: 'vendors_avatar_id_fkey',
        }),
        unique('vendors_email_key').on(table.email),
        unique('vendors_phone_key').on(table.phone),
        unique('vendors_stripe_account_id_key').on(table.stripeAccountId),
    ],
)

export const productRefundMedia = pgTable(
    'product_refund_media',
    {
        mid: integer().notNull(),
        prfid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.mid],
            foreignColumns: [media.mid],
            name: 'product_refund_media_mid_fkey',
        }),
        foreignKey({
            columns: [table.prfid],
            foreignColumns: [productRefunds.prfid],
            name: 'product_refund_media_prfid_fkey',
        }),
        primaryKey({ columns: [table.mid, table.prfid], name: 'product_refund_media_pkey' }),
    ],
)

export const productProps = pgTable(
    'product_props',
    {
        pid: integer().notNull(),
        pcpid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_props_pid_fkey',
        }),
        foreignKey({
            columns: [table.pcpid],
            foreignColumns: [productCustomProps.pcpid],
            name: 'product_props_pcpid_fkey',
        }),
        primaryKey({ columns: [table.pid, table.pcpid], name: 'product_props_pkey' }),
    ],
)

export const productReviewMedia = pgTable(
    'product_review_media',
    {
        prid: integer().notNull(),
        mid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.prid],
            foreignColumns: [productReviews.prid],
            name: 'product_review_media_prid_fkey',
        }),
        foreignKey({
            columns: [table.mid],
            foreignColumns: [media.mid],
            name: 'product_review_media_mid_fkey',
        }),
        primaryKey({ columns: [table.prid, table.mid], name: 'product_review_media_pkey' }),
    ],
)

export const clientReviewMedia = pgTable(
    'client_review_media',
    {
        crid: integer().notNull(),
        mid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.crid],
            foreignColumns: [clientReviews.crid],
            name: 'client_review_media_crid_fkey',
        }),
        foreignKey({
            columns: [table.mid],
            foreignColumns: [media.mid],
            name: 'client_review_media_mid_fkey',
        }),
        primaryKey({ columns: [table.crid, table.mid], name: 'client_review_media_pkey' }),
    ],
)

export const categoryDiscounts = pgTable(
    'category_discounts',
    {
        discountId: integer('discount_id').notNull(),
        pcid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.discountId],
            foreignColumns: [globalDiscounts.gdid],
            name: 'category_discounts_discount_id_fkey',
        }),
        foreignKey({
            columns: [table.pcid],
            foreignColumns: [productCategories.pcid],
            name: 'category_discounts_pcid_fkey',
        }),
        primaryKey({ columns: [table.discountId, table.pcid], name: 'category_discounts_pkey' }),
    ],
)

export const vendorProductDiscounts = pgTable(
    'vendor_product_discounts',
    {
        ldid: integer().notNull(),
        pid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.ldid],
            foreignColumns: [localDiscounts.ldid],
            name: 'vendor_product_discounts_ldid_fkey',
        }),
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'vendor_product_discounts_pid_fkey',
        }),
        primaryKey({ columns: [table.ldid, table.pid], name: 'vendor_product_discounts_pkey' }),
    ],
)

export const productComplaintMedia = pgTable(
    'product_complaint_media',
    {
        psid: integer().notNull(),
        mid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.psid],
            foreignColumns: [productComplaints.psid],
            name: 'product_complaint_media_psid_fkey',
        }),
        foreignKey({
            columns: [table.mid],
            foreignColumns: [media.mid],
            name: 'product_complaint_media_mid_fkey',
        }),
        primaryKey({ columns: [table.psid, table.mid], name: 'product_complaint_media_pkey' }),
    ],
)

export const vendorComplaintMedia = pgTable(
    'vendor_complaint_media',
    {
        mid: integer().notNull(),
        vcid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.mid],
            foreignColumns: [media.mid],
            name: 'vendor_complaint_media_mid_fkey',
        }),
        foreignKey({
            columns: [table.vcid],
            foreignColumns: [vendorComplaints.vcid],
            name: 'vendor_complaint_media_vcid_fkey',
        }),
        primaryKey({ columns: [table.mid, table.vcid], name: 'vendor_complaint_media_pkey' }),
    ],
)

export const managersAccessPermits = pgTable(
    'managers_access_permits',
    {
        maid: integer().notNull(),
        mapid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.maid],
            foreignColumns: [managers.maid],
            name: 'managers_access_permits_maid_fkey',
        }),
        foreignKey({
            columns: [table.mapid],
            foreignColumns: [accessPermits.apid],
            name: 'managers_access_permits_mapid_fkey',
        }),
        primaryKey({ columns: [table.maid, table.mapid], name: 'managers_access_permits_pkey' }),
    ],
)

export const vendorReviewMedia = pgTable(
    'vendor_review_media',
    {
        vrid: integer().notNull(),
        mid: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.vrid],
            foreignColumns: [vendorReviews.vrid],
            name: 'vendor_review_media_vrid_fkey',
        }),
        foreignKey({
            columns: [table.mid],
            foreignColumns: [media.mid],
            name: 'vendor_review_media_mid_fkey',
        }),
        primaryKey({ columns: [table.vrid, table.mid], name: 'vendor_review_media_pkey' }),
    ],
)

export const clientFavProducts = pgTable(
    'client_fav_products',
    {
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        clientId: integer('client_id').notNull(),
        productId: integer('product_id').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.clientId],
            foreignColumns: [clients.cid],
            name: 'client_fav_products_client_id_fkey',
        }),
        foreignKey({
            columns: [table.productId],
            foreignColumns: [products.pid],
            name: 'client_fav_products_product_id_fkey',
        }),
        primaryKey({
            columns: [table.clientId, table.productId],
            name: 'client_fav_products_pkey',
        }),
    ],
)

export const adminNotificationReadStates = pgTable(
    'admin_notification_read_states',
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        anid: bigint({ mode: 'number' }).notNull(),
        maid: integer().notNull(),
        readAt: timestamp('read_at', { mode: 'date' }).defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.anid],
            foreignColumns: [adminNotifications.anid],
            name: 'admin_notification_read_states_anid_fkey',
        }),
        foreignKey({
            columns: [table.maid],
            foreignColumns: [managers.maid],
            name: 'admin_notification_read_states_maid_fkey',
        }),
        primaryKey({
            columns: [table.anid, table.maid],
            name: 'admin_notification_read_states_pkey',
        }),
    ],
)

export const dCountryValuesLocalizations = pgTable(
    'd_country_values_localizations',
    {
        id: integer().notNull(),
        name: varchar({ length: 100 }),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.id],
            foreignColumns: [dCountries.id],
            name: 'd_country_values_localizations_id_fkey',
        }),
        primaryKey({
            columns: [table.id, table.language],
            name: 'd_country_values_localizations_pkey',
        }),
    ],
)

export const dBrandValuesLocalizations = pgTable(
    'd_brand_values_localizations',
    {
        id: integer().notNull(),
        name: varchar({ length: 100 }),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.id],
            foreignColumns: [dBrands.id],
            name: 'd_brand_values_localizations_id_fkey',
        }),
        primaryKey({
            columns: [table.id, table.language],
            name: 'd_brand_values_localizations_pkey',
        }),
    ],
)

export const dTransportCompaniesLocalizations = pgTable(
    'd_transport_companies_localizations',
    {
        id: integer().notNull(),
        name: varchar({ length: 100 }),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.id],
            foreignColumns: [dTransportCompanies.id],
            name: 'd_transport_companies_localizations_id_fkey',
        }),
        primaryKey({
            columns: [table.id, table.language],
            name: 'd_transport_companies_localizations_pkey',
        }),
    ],
)

export const globalDiscountMembers = pgTable(
    'global_discount_members',
    {
        gdid: integer().notNull(),
        vid: integer().notNull(),
        isPending: boolean('is_pending').default(false).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.gdid],
            foreignColumns: [globalDiscounts.gdid],
            name: 'global_discount_members_gdid_fkey',
        }),
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'global_discount_members_vid_fkey',
        }),
        primaryKey({ columns: [table.gdid, table.vid], name: 'global_discount_members_pkey' }),
    ],
)

export const dCustomValuesLocalizations = pgTable(
    'd_custom_values_localizations',
    {
        id: integer().notNull(),
        name: varchar({ length: 100 }),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.id],
            foreignColumns: [dCustom.id],
            name: 'd_custom_values_localizations_id_fkey',
        }),
        primaryKey({
            columns: [table.id, table.language],
            name: 'd_custom_values_localizations_pkey',
        }),
    ],
)

export const productCategoryLocalizations = pgTable(
    'product_category_localizations',
    {
        pcid: integer().notNull(),
        name: varchar({ length: 100 }),
        categoryMid: integer('category_mid'),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pcid],
            foreignColumns: [productCategories.pcid],
            name: 'product_category_localizations_pcid_fkey',
        }),
        foreignKey({
            columns: [table.categoryMid],
            foreignColumns: [media.mid],
            name: 'product_category_localizations_category_mid_fkey',
        }),
        primaryKey({
            columns: [table.pcid, table.language],
            name: 'product_category_localizations_pkey',
        }),
    ],
)

export const productMedia = pgTable(
    'product_media',
    {
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
        pid: integer().notNull(),
        mediaId: integer('media_id').notNull(),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_media_pid_fkey',
        }),
        foreignKey({
            columns: [table.mediaId],
            foreignColumns: [media.mid],
            name: 'product_media_media_id_fkey',
        }),
        primaryKey({
            columns: [table.pid, table.mediaId, table.language],
            name: 'product_media_pkey',
        }),
    ],
)

export const productCategoryPropLocalization = pgTable(
    'product_category_prop_localization',
    {
        pcpid: integer().notNull(),
        name: varchar({ length: 200 }),
        tip: varchar({ length: 200 }),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pcpid],
            foreignColumns: [productCategoryProps.pcpid],
            name: 'product_category_prop_localization_pcpid_fkey',
        }),
        primaryKey({
            columns: [table.pcpid, table.language],
            name: 'product_category_prop_localization_pkey',
        }),
    ],
)

export const productCustomPropLocalizations = pgTable(
    'product_custom_prop_localizations',
    {
        pcpid: integer().notNull(),
        name: varchar({ length: 200 }),
        description: varchar({ length: 1000 }),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pcpid],
            foreignColumns: [productCustomProps.pcpid],
            name: 'product_custom_prop_localizations_pcpid_fkey',
        }),
        primaryKey({
            columns: [table.pcpid, table.language],
            name: 'product_custom_prop_localizations_pkey',
        }),
    ],
)

export const productRemains = pgTable(
    'product_remains',
    {
        pid: integer().notNull(),
        vid: integer().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }),
        volume: integer().default(0).notNull(),
        country: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_remains_pid_fkey',
        }),
        foreignKey({
            columns: [table.vid],
            foreignColumns: [vendors.vid],
            name: 'product_remains_vid_fkey',
        }),
        foreignKey({
            columns: [table.country],
            foreignColumns: [dCountries.id],
            name: 'product_remains_country_fkey',
        }),
        primaryKey({
            columns: [table.pid, table.vid, table.country],
            name: 'product_remains_pkey',
        }),
    ],
)

export const productLocalizations = pgTable(
    'product_localizations',
    {
        pid: integer().notNull(),
        name: varchar({ length: 200 }),
        title: varchar({ length: 200 }),
        description: text(),
        comment: varchar({ length: 1000 }),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pid],
            foreignColumns: [products.pid],
            name: 'product_localizations_pid_fkey',
        }),
        primaryKey({ columns: [table.pid, table.language], name: 'product_localizations_pkey' }),
    ],
)

export const articlePublicationLocalizations = pgTable(
    'article_publication_localizations',
    {
        apid: integer().notNull(),
        mainMid: integer('main_mid'),
        title: varchar({ length: 200 }),
        annotation: varchar({ length: 500 }),
        text: text(),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.apid],
            foreignColumns: [articlePublications.apid],
            name: 'article_publication_localizations_apid_fkey',
        }),
        foreignKey({
            columns: [table.mainMid],
            foreignColumns: [media.mid],
            name: 'article_publication_localizations_main_mid_fkey',
        }),
        primaryKey({
            columns: [table.apid, table.language],
            name: 'article_publication_localizations_pkey',
        }),
    ],
)

export const newsPublicationLocalizations = pgTable(
    'news_publication_localizations',
    {
        npid: integer().notNull(),
        mainMid: integer('main_mid'),
        title: varchar({ length: 200 }),
        annotation: varchar({ length: 500 }),
        text: text(),
        language: languageVariants().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.npid],
            foreignColumns: [newsPublications.npid],
            name: 'news_publication_localizations_npid_fkey',
        }),
        foreignKey({
            columns: [table.mainMid],
            foreignColumns: [media.mid],
            name: 'news_publication_localizations_main_mid_fkey',
        }),
        primaryKey({
            columns: [table.npid, table.language],
            name: 'news_publication_localizations_pkey',
        }),
    ],
)
