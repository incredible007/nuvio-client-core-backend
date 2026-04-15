import { relations } from "drizzle-orm/relations";
import { clients, clientPayoutRequests, clientPayoutRequisites, clientReferrals, clientReferralsAccountTransactions, productRefunds, orders, products, clientAddresses, bankCardTokens, media, vendors, vendorRequisites, vendorAccounts, vendorAccountTransactions, vendorPayoutRequests, vendorBankRequisites, dTransportCompanies, vendorPhoneAuth, clientsPhoneAuth, managers, managerPasswordAuth, productCategories, dCountries, dBrands, productReviews, clientReviews, clientPaymentMethods, localDiscounts, orderToProducts, recommendedProducts, productComplaints, adminNotifications, authSessions, vendorComplaints, userGeolocations, conversations, productCategoryProps, convParticipants, convMessages, systemNotifications, managerNotifications, vendorReviews, productPrices, productSubBills, subscriptionRefunds, productSubscribers, subscriptionAuditLogs, subscriptionReminders, productRefundMedia, productProps, productCustomProps, productReviewMedia, clientReviewMedia, globalDiscounts, categoryDiscounts, vendorProductDiscounts, productComplaintMedia, vendorComplaintMedia, managersAccessPermits, accessPermits, vendorReviewMedia, clientFavProducts, adminNotificationReadStates, dCountryValuesLocalizations, dBrandValuesLocalizations, dTransportCompaniesLocalizations, globalDiscountMembers, dCustom, dCustomValuesLocalizations, productCategoryLocalizations, productMedia, productCategoryPropLocalization, productCustomPropLocalizations, productRemains, productLocalizations, articlePublications, articlePublicationLocalizations, newsPublications, newsPublicationLocalizations } from "./schema";

export const clientPayoutRequestsRelations = relations(clientPayoutRequests, ({one}) => ({
	client: one(clients, {
		fields: [clientPayoutRequests.cid],
		references: [clients.cid]
	}),
	clientPayoutRequisite: one(clientPayoutRequisites, {
		fields: [clientPayoutRequests.cpr],
		references: [clientPayoutRequisites.cpr]
	}),
}));

export const clientsRelations = relations(clients, ({one, many}) => ({
	clientPayoutRequests: many(clientPayoutRequests),
	clientReferrals_ownerCid: many(clientReferrals, {
		relationName: "clientReferrals_ownerCid_clients_cid"
	}),
	clientReferrals_reffererCid: many(clientReferrals, {
		relationName: "clientReferrals_reffererCid_clients_cid"
	}),
	clientPayoutRequisites: many(clientPayoutRequisites),
	productRefunds: many(productRefunds),
	media: one(media, {
		fields: [clients.avatarId],
		references: [media.mid]
	}),
	clientAddresses: many(clientAddresses),
	clientsPhoneAuths: many(clientsPhoneAuth),
	productReviews: many(productReviews),
	clientReviews: many(clientReviews),
	orders: many(orders),
	productComplaints: many(productComplaints),
	adminNotifications: many(adminNotifications),
	authSessions: many(authSessions),
	vendorComplaints: many(vendorComplaints),
	userGeolocations: many(userGeolocations),
	convParticipants: many(convParticipants),
	convMessages: many(convMessages),
	vendorReviews: many(vendorReviews),
	productSubscribers: many(productSubscribers),
	clientPaymentMethods: many(clientPaymentMethods),
	clientFavProducts: many(clientFavProducts),
}));

export const clientPayoutRequisitesRelations = relations(clientPayoutRequisites, ({one, many}) => ({
	clientPayoutRequests: many(clientPayoutRequests),
	client: one(clients, {
		fields: [clientPayoutRequisites.cid],
		references: [clients.cid]
	}),
}));

export const clientReferralsRelations = relations(clientReferrals, ({one, many}) => ({
	client_ownerCid: one(clients, {
		fields: [clientReferrals.ownerCid],
		references: [clients.cid],
		relationName: "clientReferrals_ownerCid_clients_cid"
	}),
	client_reffererCid: one(clients, {
		fields: [clientReferrals.reffererCid],
		references: [clients.cid],
		relationName: "clientReferrals_reffererCid_clients_cid"
	}),
	clientReferralsAccountTransactions: many(clientReferralsAccountTransactions),
}));

export const clientReferralsAccountTransactionsRelations = relations(clientReferralsAccountTransactions, ({one}) => ({
	clientReferral: one(clientReferrals, {
		fields: [clientReferralsAccountTransactions.crid],
		references: [clientReferrals.crid]
	}),
}));

export const productRefundsRelations = relations(productRefunds, ({one, many}) => ({
	client: one(clients, {
		fields: [productRefunds.cid],
		references: [clients.cid]
	}),
	order: one(orders, {
		fields: [productRefunds.oid],
		references: [orders.oid]
	}),
	product: one(products, {
		fields: [productRefunds.pid],
		references: [products.pid]
	}),
	adminNotifications: many(adminNotifications),
	systemNotifications: many(systemNotifications),
	productRefundMedias: many(productRefundMedia),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	productRefunds: many(productRefunds),
	client: one(clients, {
		fields: [orders.clientId],
		references: [clients.cid]
	}),
	clientAddress: one(clientAddresses, {
		fields: [orders.clientAddressId],
		references: [clientAddresses.caid]
	}),
	clientPaymentMethod: one(clientPaymentMethods, {
		fields: [orders.cpmid],
		references: [clientPaymentMethods.cpmid]
	}),
	orderToProducts: many(orderToProducts),
	conversations: many(conversations),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	productRefunds: many(productRefunds),
	vendor: one(vendors, {
		fields: [products.vendorOwnerId],
		references: [vendors.vid]
	}),
	productCategory: one(productCategories, {
		fields: [products.pcid],
		references: [productCategories.pcid]
	}),
	dCountry: one(dCountries, {
		fields: [products.countryId],
		references: [dCountries.id]
	}),
	dBrand: one(dBrands, {
		fields: [products.brandId],
		references: [dBrands.id]
	}),
	productReviews: many(productReviews),
	orderToProducts: many(orderToProducts),
	recommendedProducts_productId: many(recommendedProducts, {
		relationName: "recommendedProducts_productId_products_pid"
	}),
	recommendedProducts_recommendedGoodId: many(recommendedProducts, {
		relationName: "recommendedProducts_recommendedGoodId_products_pid"
	}),
	productComplaints: many(productComplaints),
	adminNotifications: many(adminNotifications),
	conversations: many(conversations),
	productPrices: many(productPrices),
	productSubscribers: many(productSubscribers),
	productProps: many(productProps),
	vendorProductDiscounts: many(vendorProductDiscounts),
	clientFavProducts: many(clientFavProducts),
	productMedias: many(productMedia),
	productRemains: many(productRemains),
	productLocalizations: many(productLocalizations),
}));

export const bankCardTokensRelations = relations(bankCardTokens, ({one}) => ({
	clientAddress: one(clientAddresses, {
		fields: [bankCardTokens.caid],
		references: [clientAddresses.caid]
	}),
}));

export const clientAddressesRelations = relations(clientAddresses, ({one, many}) => ({
	bankCardTokens: many(bankCardTokens),
	client: one(clients, {
		fields: [clientAddresses.clientId],
		references: [clients.cid]
	}),
	dTransportCompany: one(dTransportCompanies, {
		fields: [clientAddresses.transportCompany],
		references: [dTransportCompanies.id]
	}),
	orders: many(orders),
}));

export const mediaRelations = relations(media, ({many}) => ({
	clients: many(clients),
	conversations: many(conversations),
	vendors: many(vendors),
	productRefundMedias: many(productRefundMedia),
	productReviewMedias: many(productReviewMedia),
	clientReviewMedias: many(clientReviewMedia),
	productComplaintMedias: many(productComplaintMedia),
	vendorComplaintMedias: many(vendorComplaintMedia),
	vendorReviewMedias: many(vendorReviewMedia),
	productCategoryLocalizations: many(productCategoryLocalizations),
	productMedias: many(productMedia),
	articlePublicationLocalizations: many(articlePublicationLocalizations),
	newsPublicationLocalizations: many(newsPublicationLocalizations),
}));

export const vendorRequisitesRelations = relations(vendorRequisites, ({one, many}) => ({
	vendor: one(vendors, {
		fields: [vendorRequisites.vid],
		references: [vendors.vid]
	}),
	vendorBankRequisites: many(vendorBankRequisites),
}));

export const vendorsRelations = relations(vendors, ({one, many}) => ({
	vendorRequisites: many(vendorRequisites),
	vendorPhoneAuths: many(vendorPhoneAuth),
	products: many(products),
	clientReviews: many(clientReviews),
	localDiscounts: many(localDiscounts),
	adminNotifications: many(adminNotifications),
	authSessions: many(authSessions),
	vendorComplaints: many(vendorComplaints),
	convParticipants: many(convParticipants),
	convMessages: many(convMessages),
	vendorBankRequisites: many(vendorBankRequisites),
	vendorAccounts: many(vendorAccounts),
	vendorReviews: many(vendorReviews),
	systemNotifications: many(systemNotifications),
	media: one(media, {
		fields: [vendors.avatarId],
		references: [media.mid]
	}),
	globalDiscountMembers: many(globalDiscountMembers),
	productRemains: many(productRemains),
}));

export const vendorAccountTransactionsRelations = relations(vendorAccountTransactions, ({one}) => ({
	vendorAccount: one(vendorAccounts, {
		fields: [vendorAccountTransactions.vaid],
		references: [vendorAccounts.vaid]
	}),
}));

export const vendorAccountsRelations = relations(vendorAccounts, ({one, many}) => ({
	vendorAccountTransactions: many(vendorAccountTransactions),
	vendorPayoutRequests: many(vendorPayoutRequests),
	vendor: one(vendors, {
		fields: [vendorAccounts.vid],
		references: [vendors.vid]
	}),
}));

export const vendorPayoutRequestsRelations = relations(vendorPayoutRequests, ({one}) => ({
	vendorAccount: one(vendorAccounts, {
		fields: [vendorPayoutRequests.vaid],
		references: [vendorAccounts.vaid]
	}),
	vendorBankRequisite: one(vendorBankRequisites, {
		fields: [vendorPayoutRequests.vbrid],
		references: [vendorBankRequisites.vbrid]
	}),
}));

export const vendorBankRequisitesRelations = relations(vendorBankRequisites, ({one, many}) => ({
	vendorPayoutRequests: many(vendorPayoutRequests),
	vendor: one(vendors, {
		fields: [vendorBankRequisites.vid],
		references: [vendors.vid]
	}),
	vendorRequisite: one(vendorRequisites, {
		fields: [vendorBankRequisites.vrqid],
		references: [vendorRequisites.vrqid]
	}),
}));

export const dTransportCompaniesRelations = relations(dTransportCompanies, ({many}) => ({
	clientAddresses: many(clientAddresses),
	dTransportCompaniesLocalizations: many(dTransportCompaniesLocalizations),
}));

export const vendorPhoneAuthRelations = relations(vendorPhoneAuth, ({one}) => ({
	vendor: one(vendors, {
		fields: [vendorPhoneAuth.vendorId],
		references: [vendors.vid]
	}),
}));

export const clientsPhoneAuthRelations = relations(clientsPhoneAuth, ({one}) => ({
	client: one(clients, {
		fields: [clientsPhoneAuth.clientId],
		references: [clients.cid]
	}),
}));

export const managerPasswordAuthRelations = relations(managerPasswordAuth, ({one}) => ({
	manager: one(managers, {
		fields: [managerPasswordAuth.managerId],
		references: [managers.maid]
	}),
}));

export const managersRelations = relations(managers, ({many}) => ({
	managerPasswordAuths: many(managerPasswordAuth),
	authSessions: many(authSessions),
	convParticipants: many(convParticipants),
	convMessages: many(convMessages),
	managerNotifications: many(managerNotifications),
	managersAccessPermits: many(managersAccessPermits),
	adminNotificationReadStates: many(adminNotificationReadStates),
}));

export const productCategoriesRelations = relations(productCategories, ({one, many}) => ({
	products: many(products),
	productCategory: one(productCategories, {
		fields: [productCategories.parentCategoryId],
		references: [productCategories.pcid],
		relationName: "productCategories_parentCategoryId_productCategories_pcid"
	}),
	productCategories: many(productCategories, {
		relationName: "productCategories_parentCategoryId_productCategories_pcid"
	}),
	productCategoryProps: many(productCategoryProps),
	categoryDiscounts: many(categoryDiscounts),
	productCategoryLocalizations: many(productCategoryLocalizations),
}));

export const dCountriesRelations = relations(dCountries, ({many}) => ({
	products: many(products),
	productPrices: many(productPrices),
	dCountryValuesLocalizations: many(dCountryValuesLocalizations),
	productRemains: many(productRemains),
}));

export const dBrandsRelations = relations(dBrands, ({many}) => ({
	products: many(products),
	dBrandValuesLocalizations: many(dBrandValuesLocalizations),
}));

export const productReviewsRelations = relations(productReviews, ({one, many}) => ({
	client: one(clients, {
		fields: [productReviews.cid],
		references: [clients.cid]
	}),
	product: one(products, {
		fields: [productReviews.pid],
		references: [products.pid]
	}),
	adminNotifications: many(adminNotifications),
	systemNotifications: many(systemNotifications),
	productReviewMedias: many(productReviewMedia),
}));

export const clientReviewsRelations = relations(clientReviews, ({one, many}) => ({
	client: one(clients, {
		fields: [clientReviews.toCid],
		references: [clients.cid]
	}),
	vendor: one(vendors, {
		fields: [clientReviews.fromVid],
		references: [vendors.vid]
	}),
	clientReviewMedias: many(clientReviewMedia),
}));

export const clientPaymentMethodsRelations = relations(clientPaymentMethods, ({one, many}) => ({
	orders: many(orders),
	client: one(clients, {
		fields: [clientPaymentMethods.clientId],
		references: [clients.cid]
	}),
}));

export const localDiscountsRelations = relations(localDiscounts, ({one, many}) => ({
	vendor: one(vendors, {
		fields: [localDiscounts.vid],
		references: [vendors.vid]
	}),
	vendorProductDiscounts: many(vendorProductDiscounts),
}));

export const orderToProductsRelations = relations(orderToProducts, ({one}) => ({
	product: one(products, {
		fields: [orderToProducts.productId],
		references: [products.pid]
	}),
	order: one(orders, {
		fields: [orderToProducts.orderId],
		references: [orders.oid]
	}),
}));

export const recommendedProductsRelations = relations(recommendedProducts, ({one}) => ({
	product_productId: one(products, {
		fields: [recommendedProducts.productId],
		references: [products.pid],
		relationName: "recommendedProducts_productId_products_pid"
	}),
	product_recommendedGoodId: one(products, {
		fields: [recommendedProducts.recommendedGoodId],
		references: [products.pid],
		relationName: "recommendedProducts_recommendedGoodId_products_pid"
	}),
}));

export const productComplaintsRelations = relations(productComplaints, ({one, many}) => ({
	client: one(clients, {
		fields: [productComplaints.cid],
		references: [clients.cid]
	}),
	product: one(products, {
		fields: [productComplaints.pid],
		references: [products.pid]
	}),
	adminNotifications: many(adminNotifications),
	systemNotifications: many(systemNotifications),
	productComplaintMedias: many(productComplaintMedia),
}));

export const adminNotificationsRelations = relations(adminNotifications, ({one, many}) => ({
	client: one(clients, {
		fields: [adminNotifications.cid],
		references: [clients.cid]
	}),
	product: one(products, {
		fields: [adminNotifications.pid],
		references: [products.pid]
	}),
	productReview: one(productReviews, {
		fields: [adminNotifications.prid],
		references: [productReviews.prid]
	}),
	productComplaint: one(productComplaints, {
		fields: [adminNotifications.pcid],
		references: [productComplaints.psid]
	}),
	vendor: one(vendors, {
		fields: [adminNotifications.vid],
		references: [vendors.vid]
	}),
	productRefund: one(productRefunds, {
		fields: [adminNotifications.prfid],
		references: [productRefunds.prfid]
	}),
	adminNotificationReadStates: many(adminNotificationReadStates),
}));

export const authSessionsRelations = relations(authSessions, ({one}) => ({
	client: one(clients, {
		fields: [authSessions.clientId],
		references: [clients.cid]
	}),
	manager: one(managers, {
		fields: [authSessions.managerId],
		references: [managers.maid]
	}),
	vendor: one(vendors, {
		fields: [authSessions.vendorId],
		references: [vendors.vid]
	}),
}));

export const vendorComplaintsRelations = relations(vendorComplaints, ({one, many}) => ({
	client: one(clients, {
		fields: [vendorComplaints.cid],
		references: [clients.cid]
	}),
	vendor: one(vendors, {
		fields: [vendorComplaints.vid],
		references: [vendors.vid]
	}),
	vendorComplaintMedias: many(vendorComplaintMedia),
}));

export const userGeolocationsRelations = relations(userGeolocations, ({one}) => ({
	client: one(clients, {
		fields: [userGeolocations.cid],
		references: [clients.cid]
	}),
}));

export const conversationsRelations = relations(conversations, ({one, many}) => ({
	product: one(products, {
		fields: [conversations.pid],
		references: [products.pid]
	}),
	order: one(orders, {
		fields: [conversations.oid],
		references: [orders.oid]
	}),
	media: one(media, {
		fields: [conversations.avatarMid],
		references: [media.mid]
	}),
	convParticipants: many(convParticipants),
	convMessages: many(convMessages),
}));

export const productCategoryPropsRelations = relations(productCategoryProps, ({one, many}) => ({
	productCategory: one(productCategories, {
		fields: [productCategoryProps.pcid],
		references: [productCategories.pcid]
	}),
	productCategoryPropLocalizations: many(productCategoryPropLocalization),
}));

export const convParticipantsRelations = relations(convParticipants, ({one}) => ({
	conversation: one(conversations, {
		fields: [convParticipants.convid],
		references: [conversations.convid]
	}),
	vendor: one(vendors, {
		fields: [convParticipants.vid],
		references: [vendors.vid]
	}),
	client: one(clients, {
		fields: [convParticipants.cid],
		references: [clients.cid]
	}),
	manager: one(managers, {
		fields: [convParticipants.maid],
		references: [managers.maid]
	}),
	convMessage: one(convMessages, {
		fields: [convParticipants.lastReadMesid],
		references: [convMessages.mesid]
	}),
}));

export const convMessagesRelations = relations(convMessages, ({one, many}) => ({
	convParticipants: many(convParticipants),
	conversation: one(conversations, {
		fields: [convMessages.convid],
		references: [conversations.convid]
	}),
	vendor: one(vendors, {
		fields: [convMessages.vid],
		references: [vendors.vid]
	}),
	client: one(clients, {
		fields: [convMessages.cid],
		references: [clients.cid]
	}),
	manager: one(managers, {
		fields: [convMessages.maid],
		references: [managers.maid]
	}),
}));

export const managerNotificationsRelations = relations(managerNotifications, ({one}) => ({
	systemNotification: one(systemNotifications, {
		fields: [managerNotifications.notificationId],
		references: [systemNotifications.id]
	}),
	manager: one(managers, {
		fields: [managerNotifications.managerId],
		references: [managers.maid]
	}),
}));

export const systemNotificationsRelations = relations(systemNotifications, ({one, many}) => ({
	managerNotifications: many(managerNotifications),
	vendor: one(vendors, {
		fields: [systemNotifications.vid],
		references: [vendors.vid]
	}),
	productReview: one(productReviews, {
		fields: [systemNotifications.prid],
		references: [productReviews.prid]
	}),
	productComplaint: one(productComplaints, {
		fields: [systemNotifications.complaintId],
		references: [productComplaints.psid]
	}),
	productRefund: one(productRefunds, {
		fields: [systemNotifications.prfid],
		references: [productRefunds.prfid]
	}),
}));

export const vendorReviewsRelations = relations(vendorReviews, ({one, many}) => ({
	vendor: one(vendors, {
		fields: [vendorReviews.toVid],
		references: [vendors.vid]
	}),
	client: one(clients, {
		fields: [vendorReviews.fromCid],
		references: [clients.cid]
	}),
	vendorReviewMedias: many(vendorReviewMedia),
}));

export const productPricesRelations = relations(productPrices, ({one, many}) => ({
	product: one(products, {
		fields: [productPrices.pid],
		references: [products.pid]
	}),
	dCountry: one(dCountries, {
		fields: [productPrices.countryId],
		references: [dCountries.id]
	}),
	productSubscribers: many(productSubscribers),
}));

export const subscriptionRefundsRelations = relations(subscriptionRefunds, ({one}) => ({
	productSubBill: one(productSubBills, {
		fields: [subscriptionRefunds.psbid],
		references: [productSubBills.psbid]
	}),
	productSubscriber: one(productSubscribers, {
		fields: [subscriptionRefunds.psid],
		references: [productSubscribers.psid]
	}),
}));

export const productSubBillsRelations = relations(productSubBills, ({one, many}) => ({
	subscriptionRefunds: many(subscriptionRefunds),
	subscriptionReminders: many(subscriptionReminders),
	productSubscriber: one(productSubscribers, {
		fields: [productSubBills.psid],
		references: [productSubscribers.psid]
	}),
}));

export const productSubscribersRelations = relations(productSubscribers, ({one, many}) => ({
	subscriptionRefunds: many(subscriptionRefunds),
	subscriptionAuditLogs: many(subscriptionAuditLogs),
	subscriptionReminders: many(subscriptionReminders),
	product: one(products, {
		fields: [productSubscribers.pid],
		references: [products.pid]
	}),
	client: one(clients, {
		fields: [productSubscribers.cid],
		references: [clients.cid]
	}),
	productPrice: one(productPrices, {
		fields: [productSubscribers.productPrice],
		references: [productPrices.ppid]
	}),
	productSubBills: many(productSubBills),
}));

export const subscriptionAuditLogsRelations = relations(subscriptionAuditLogs, ({one}) => ({
	productSubscriber: one(productSubscribers, {
		fields: [subscriptionAuditLogs.psid],
		references: [productSubscribers.psid]
	}),
}));

export const subscriptionRemindersRelations = relations(subscriptionReminders, ({one}) => ({
	productSubscriber: one(productSubscribers, {
		fields: [subscriptionReminders.psid],
		references: [productSubscribers.psid]
	}),
	productSubBill: one(productSubBills, {
		fields: [subscriptionReminders.psbid],
		references: [productSubBills.psbid]
	}),
}));

export const productRefundMediaRelations = relations(productRefundMedia, ({one}) => ({
	media: one(media, {
		fields: [productRefundMedia.mid],
		references: [media.mid]
	}),
	productRefund: one(productRefunds, {
		fields: [productRefundMedia.prfid],
		references: [productRefunds.prfid]
	}),
}));

export const productPropsRelations = relations(productProps, ({one}) => ({
	product: one(products, {
		fields: [productProps.pid],
		references: [products.pid]
	}),
	productCustomProp: one(productCustomProps, {
		fields: [productProps.pcpid],
		references: [productCustomProps.pcpid]
	}),
}));

export const productCustomPropsRelations = relations(productCustomProps, ({many}) => ({
	productProps: many(productProps),
	productCustomPropLocalizations: many(productCustomPropLocalizations),
}));

export const productReviewMediaRelations = relations(productReviewMedia, ({one}) => ({
	productReview: one(productReviews, {
		fields: [productReviewMedia.prid],
		references: [productReviews.prid]
	}),
	media: one(media, {
		fields: [productReviewMedia.mid],
		references: [media.mid]
	}),
}));

export const clientReviewMediaRelations = relations(clientReviewMedia, ({one}) => ({
	clientReview: one(clientReviews, {
		fields: [clientReviewMedia.crid],
		references: [clientReviews.crid]
	}),
	media: one(media, {
		fields: [clientReviewMedia.mid],
		references: [media.mid]
	}),
}));

export const categoryDiscountsRelations = relations(categoryDiscounts, ({one}) => ({
	globalDiscount: one(globalDiscounts, {
		fields: [categoryDiscounts.discountId],
		references: [globalDiscounts.gdid]
	}),
	productCategory: one(productCategories, {
		fields: [categoryDiscounts.pcid],
		references: [productCategories.pcid]
	}),
}));

export const globalDiscountsRelations = relations(globalDiscounts, ({many}) => ({
	categoryDiscounts: many(categoryDiscounts),
	globalDiscountMembers: many(globalDiscountMembers),
}));

export const vendorProductDiscountsRelations = relations(vendorProductDiscounts, ({one}) => ({
	localDiscount: one(localDiscounts, {
		fields: [vendorProductDiscounts.ldid],
		references: [localDiscounts.ldid]
	}),
	product: one(products, {
		fields: [vendorProductDiscounts.pid],
		references: [products.pid]
	}),
}));

export const productComplaintMediaRelations = relations(productComplaintMedia, ({one}) => ({
	productComplaint: one(productComplaints, {
		fields: [productComplaintMedia.psid],
		references: [productComplaints.psid]
	}),
	media: one(media, {
		fields: [productComplaintMedia.mid],
		references: [media.mid]
	}),
}));

export const vendorComplaintMediaRelations = relations(vendorComplaintMedia, ({one}) => ({
	media: one(media, {
		fields: [vendorComplaintMedia.mid],
		references: [media.mid]
	}),
	vendorComplaint: one(vendorComplaints, {
		fields: [vendorComplaintMedia.vcid],
		references: [vendorComplaints.vcid]
	}),
}));

export const managersAccessPermitsRelations = relations(managersAccessPermits, ({one}) => ({
	manager: one(managers, {
		fields: [managersAccessPermits.maid],
		references: [managers.maid]
	}),
	accessPermit: one(accessPermits, {
		fields: [managersAccessPermits.mapid],
		references: [accessPermits.apid]
	}),
}));

export const accessPermitsRelations = relations(accessPermits, ({many}) => ({
	managersAccessPermits: many(managersAccessPermits),
}));

export const vendorReviewMediaRelations = relations(vendorReviewMedia, ({one}) => ({
	vendorReview: one(vendorReviews, {
		fields: [vendorReviewMedia.vrid],
		references: [vendorReviews.vrid]
	}),
	media: one(media, {
		fields: [vendorReviewMedia.mid],
		references: [media.mid]
	}),
}));

export const clientFavProductsRelations = relations(clientFavProducts, ({one}) => ({
	client: one(clients, {
		fields: [clientFavProducts.clientId],
		references: [clients.cid]
	}),
	product: one(products, {
		fields: [clientFavProducts.productId],
		references: [products.pid]
	}),
}));

export const adminNotificationReadStatesRelations = relations(adminNotificationReadStates, ({one}) => ({
	adminNotification: one(adminNotifications, {
		fields: [adminNotificationReadStates.anid],
		references: [adminNotifications.anid]
	}),
	manager: one(managers, {
		fields: [adminNotificationReadStates.maid],
		references: [managers.maid]
	}),
}));

export const dCountryValuesLocalizationsRelations = relations(dCountryValuesLocalizations, ({one}) => ({
	dCountry: one(dCountries, {
		fields: [dCountryValuesLocalizations.id],
		references: [dCountries.id]
	}),
}));

export const dBrandValuesLocalizationsRelations = relations(dBrandValuesLocalizations, ({one}) => ({
	dBrand: one(dBrands, {
		fields: [dBrandValuesLocalizations.id],
		references: [dBrands.id]
	}),
}));

export const dTransportCompaniesLocalizationsRelations = relations(dTransportCompaniesLocalizations, ({one}) => ({
	dTransportCompany: one(dTransportCompanies, {
		fields: [dTransportCompaniesLocalizations.id],
		references: [dTransportCompanies.id]
	}),
}));

export const globalDiscountMembersRelations = relations(globalDiscountMembers, ({one}) => ({
	globalDiscount: one(globalDiscounts, {
		fields: [globalDiscountMembers.gdid],
		references: [globalDiscounts.gdid]
	}),
	vendor: one(vendors, {
		fields: [globalDiscountMembers.vid],
		references: [vendors.vid]
	}),
}));

export const dCustomValuesLocalizationsRelations = relations(dCustomValuesLocalizations, ({one}) => ({
	dCustom: one(dCustom, {
		fields: [dCustomValuesLocalizations.id],
		references: [dCustom.id]
	}),
}));

export const dCustomRelations = relations(dCustom, ({many}) => ({
	dCustomValuesLocalizations: many(dCustomValuesLocalizations),
}));

export const productCategoryLocalizationsRelations = relations(productCategoryLocalizations, ({one}) => ({
	productCategory: one(productCategories, {
		fields: [productCategoryLocalizations.pcid],
		references: [productCategories.pcid]
	}),
	media: one(media, {
		fields: [productCategoryLocalizations.categoryMid],
		references: [media.mid]
	}),
}));

export const productMediaRelations = relations(productMedia, ({one}) => ({
	product: one(products, {
		fields: [productMedia.pid],
		references: [products.pid]
	}),
	media: one(media, {
		fields: [productMedia.mediaId],
		references: [media.mid]
	}),
}));

export const productCategoryPropLocalizationRelations = relations(productCategoryPropLocalization, ({one}) => ({
	productCategoryProp: one(productCategoryProps, {
		fields: [productCategoryPropLocalization.pcpid],
		references: [productCategoryProps.pcpid]
	}),
}));

export const productCustomPropLocalizationsRelations = relations(productCustomPropLocalizations, ({one}) => ({
	productCustomProp: one(productCustomProps, {
		fields: [productCustomPropLocalizations.pcpid],
		references: [productCustomProps.pcpid]
	}),
}));

export const productRemainsRelations = relations(productRemains, ({one}) => ({
	product: one(products, {
		fields: [productRemains.pid],
		references: [products.pid]
	}),
	vendor: one(vendors, {
		fields: [productRemains.vid],
		references: [vendors.vid]
	}),
	dCountry: one(dCountries, {
		fields: [productRemains.country],
		references: [dCountries.id]
	}),
}));

export const productLocalizationsRelations = relations(productLocalizations, ({one}) => ({
	product: one(products, {
		fields: [productLocalizations.pid],
		references: [products.pid]
	}),
}));

export const articlePublicationLocalizationsRelations = relations(articlePublicationLocalizations, ({one}) => ({
	articlePublication: one(articlePublications, {
		fields: [articlePublicationLocalizations.apid],
		references: [articlePublications.apid]
	}),
	media: one(media, {
		fields: [articlePublicationLocalizations.mainMid],
		references: [media.mid]
	}),
}));

export const articlePublicationsRelations = relations(articlePublications, ({many}) => ({
	articlePublicationLocalizations: many(articlePublicationLocalizations),
}));

export const newsPublicationLocalizationsRelations = relations(newsPublicationLocalizations, ({one}) => ({
	newsPublication: one(newsPublications, {
		fields: [newsPublicationLocalizations.npid],
		references: [newsPublications.npid]
	}),
	media: one(media, {
		fields: [newsPublicationLocalizations.mainMid],
		references: [media.mid]
	}),
}));

export const newsPublicationsRelations = relations(newsPublications, ({many}) => ({
	newsPublicationLocalizations: many(newsPublicationLocalizations),
}));