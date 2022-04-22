import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Settings = React.lazy(() => import('./views/settings/view'))
const ContactUs = React.lazy(() => import('./views/contactus/view'))
const Feedback = React.lazy(() => import('./views/feedback/view'))
const NotificationLogs = React.lazy(() => import('./views/notification-logs/view'))
const SendNotification = React.lazy(() => import('./views/send-notification/view'))
const Transaction = React.lazy(() => import('./views/transaction/view'))
const Sales = React.lazy(() => import('./views/sales/view'))
// Language
const LanView = React.lazy(() => import('./views/language/view'))
const LanAdd = React.lazy(() => import('./views/language/add'))
const LanEdit = React.lazy(() => import('./views/language/edit'))
// Role
const RoleView = React.lazy(() => import('./views/role/view'))
const RoleAdd = React.lazy(() => import('./views/role/add'))
const RoleEdit = React.lazy(() => import('./views/role/edit'))
// Label
const LabelView = React.lazy(() => import('./views/label/view'))
const LabelAdd = React.lazy(() => import('./views/label/add'))
const LabelEdit = React.lazy(() => import('./views/label/edit'))
// CMS
const CmsView = React.lazy(() => import('./views/cms/view'))
const CmsAdd = React.lazy(() => import('./views/cms/add'))
const CmsEdit = React.lazy(() => import('./views/cms/edit'))
// FAQ Category
const FaqCategoryView = React.lazy(() => import('./views/faq-category/view'))
const FaqCategoryAdd = React.lazy(() => import('./views/faq-category/add'))
const FaqCategoryEdit = React.lazy(() => import('./views/faq-category/edit'))
// FAQ
const FaqView = React.lazy(() => import('./views/faq/view'))
const FaqAdd = React.lazy(() => import('./views/faq/add'))
const FaqEdit = React.lazy(() => import('./views/faq/edit'))
// Email
const EmailTemplateView = React.lazy(() => import('./views/email/view'))
const EmailTemplateAdd = React.lazy(() => import('./views/email/add'))
const EmailTemplateEdit = React.lazy(() => import('./views/email/edit'))
// Push
const PushTemplateView = React.lazy(() => import('./views/push/view'))
const PushTemplateAdd = React.lazy(() => import('./views/push/add'))
const PushTemplateEdit = React.lazy(() => import('./views/push/edit'))
// SMS
const SmsTemplateView = React.lazy(() => import('./views/sms/view'))
const SmsTemplateAdd = React.lazy(() => import('./views/sms/add'))
const SmsTemplateEdit = React.lazy(() => import('./views/sms/edit'))
// Service Category
const ServiceCategoryView = React.lazy(() => import('./views/service-category/view'))
const ServiceCategoryAdd = React.lazy(() => import('./views/service-category/add'))
const ServiceCategoryEdit = React.lazy(() => import('./views/service-category/edit'))
// Service Addon
const ServiceAddonView = React.lazy(() => import('./views/service-addon/view'))
const ServiceAddonAdd = React.lazy(() => import('./views/service-addon/add'))
const ServiceAddonEdit = React.lazy(() => import('./views/service-addon/edit'))
// User or partner
const UserView = React.lazy(() => import('./views/user/view'))
const UserAdd = React.lazy(() => import('./views/user/add'))
const UserEdit = React.lazy(() => import('./views/user/edit'))
// Delivery Staff
const DeliveryStaffView = React.lazy(() => import('./views/delivery-staff/view'))
const DeliveryStaffAdd = React.lazy(() => import('./views/delivery-staff/add'))
const DeliveryStaffEdit = React.lazy(() => import('./views/delivery-staff/edit'))
// Customer
const CustomerView = React.lazy(() => import('./views/customer/view'))
const CustomerAdd = React.lazy(() => import('./views/customer/add'))
const CustomerEdit = React.lazy(() => import('./views/customer/edit'))
const CustomerProfile = React.lazy(() => import('./views/customer/profile'))
// Package
const PackageView = React.lazy(() => import('./views/package/view'))
const PackageAdd = React.lazy(() => import('./views/package/add'))
const PackageEdit = React.lazy(() => import('./views/package/edit'))
// Attribute
const AttributeView = React.lazy(() => import('./views/attribute/view'))
const AttributeAdd = React.lazy(() => import('./views/attribute/add'))
const AttributeEdit = React.lazy(() => import('./views/attribute/edit'))
// SubAttribute
const SubAttributeView = React.lazy(() => import('./views/sub-attribute/view'))
const SubAttributeAdd = React.lazy(() => import('./views/sub-attribute/add'))
const SubAttributeEdit = React.lazy(() => import('./views/sub-attribute/edit'))
// Orders
const PendingOrder = React.lazy(() => import('./views/orders/pending'))
const AssignPickupOrder = React.lazy(() => import('./views/orders/assign-pickup'))
const AtTheShopOrder = React.lazy(() => import('./views/orders/at-the-shop'))
const InprocessOrder = React.lazy(() => import('./views/orders/inprocess'))
const PickupOrder = React.lazy(() => import('./views/orders/pickup'))
const ConfirmOrder = React.lazy(() => import('./views/orders/confirm'))
const WaitingOrder = React.lazy(() => import('./views/orders/waiting'))
const ReadyOrder = React.lazy(() => import('./views/orders/ready'))
const DeliveredOrder = React.lazy(() => import('./views/orders/delivered'))
const CancelOrder = React.lazy(() => import('./views/orders/cancel'))
const OrderDetail = React.lazy(() => import('./views/orders/detail'))
// Coupon
const CouponView = React.lazy(() => import('./views/coupon/view'))
const CouponAdd = React.lazy(() => import('./views/coupon/add'))
const CouponEdit = React.lazy(() => import('./views/coupon/edit'))



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  	{ path: '/', exact: true, name: 'Home', },
  	{ path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/settings', name: 'Settings', component: Settings },
    { path: '/contact-us', name: 'Contact Us', component: ContactUs },
    { path: '/feedback', name: 'Feedback', component: Feedback },
    { path: '/notification-logs', name: 'Notification Logs', component: NotificationLogs },
    { path: '/send-notification', name: 'Send Notification', component: SendNotification },
    { path: '/transactions', name: 'Transaction', component: Transaction },
    { path: '/sales', name: 'Sales', component: Sales },
  	{ path: '/language/view', name: 'Language', component: LanView },
  	{ path: '/language/add', name: 'Language', component: LanAdd },
  	{ path: '/language/edit', name: 'Language', component: LanEdit },
    { path: '/role/view', name: 'Role', component: RoleView },
    { path: '/role/add', name: 'Role', component: RoleAdd },
    { path: '/role/edit', name: 'Role', component: RoleEdit },
  	{ path: '/label/view', name: 'Label', component: LabelView },
  	{ path: '/label/add', name: 'Label', component: LabelAdd },
  	{ path: '/label/edit', name: 'Label', component: LabelEdit },
  	{ path: '/cms/view', name: 'Cms', component: CmsView },
  	{ path: '/cms/add', name: 'Cms', component: CmsAdd },
  	{ path: '/cms/edit', name: 'Cms', component: CmsEdit },
    { path: '/faq-category/view', name: 'Faq Category', component: FaqCategoryView },
    { path: '/faq-category/add', name: 'Faq Category', component: FaqCategoryAdd },
    { path: '/faq-category/edit', name: 'Faq Category', component: FaqCategoryEdit },
    { path: '/faq/view', name: 'Faq', component: FaqView },
    { path: '/faq/add', name: 'Faq', component: FaqAdd },
    { path: '/faq/edit', name: 'Faq', component: FaqEdit },
    { path: '/email/view', name: 'Email', component: EmailTemplateView },
    { path: '/email/add', name: 'Email', component: EmailTemplateAdd },
    { path: '/email/edit', name: 'Email', component: EmailTemplateEdit },
    { path: '/push/view', name: 'Push', component: PushTemplateView },
    { path: '/push/add', name: 'Push', component: PushTemplateAdd },
    { path: '/push/edit', name: 'Push', component: PushTemplateEdit },
    { path: '/sms/view', name: 'Sms', component: SmsTemplateView },
    { path: '/sms/add', name: 'Sms', component: SmsTemplateAdd },
    { path: '/sms/edit', name: 'Sms', component: SmsTemplateEdit },
    { path: '/service-category/view', name: 'Service Category', component: ServiceCategoryView },
    { path: '/service-category/add', name: 'Service Category', component: ServiceCategoryAdd },
    { path: '/service-category/edit', name: 'Service Category', component: ServiceCategoryEdit },
    { path: '/service-addon/view', name: 'Service Addon', component: ServiceAddonView },
    { path: '/service-addon/add', name: 'Service Addon', component: ServiceAddonAdd },
    { path: '/service-addon/edit', name: 'Service Addon', component: ServiceAddonEdit },
    { path: '/user/view', name: 'User', component: UserView },
    { path: '/user/add', name: 'User', component: UserAdd },
    { path: '/user/edit', name: 'User', component: UserEdit },
    { path: '/delivery-staff/view', name: 'Delivery Staff', component: DeliveryStaffView },
    { path: '/delivery-staff/add', name: 'Delivery Staff', component: DeliveryStaffAdd },
    { path: '/delivery-staff/edit', name: 'Delivery Staff', component: DeliveryStaffEdit },
    { path: '/customer/view', name: 'Customer', component: CustomerView },
    { path: '/customer/add', name: 'Customer', component: CustomerAdd },
    { path: '/customer/edit', name: 'Customer', component: CustomerEdit },
    { path: '/customer/profile', name: 'Customer Profile', component: CustomerProfile },
    { path: '/package/view', name: 'Package', component: PackageView },
    { path: '/package/add', name: 'Package', component: PackageAdd },
    { path: '/package/edit', name: 'Package', component: PackageEdit },
    { path: '/attribute/view', name: 'Attribute', component: AttributeView },
    { path: '/attribute/add', name: 'Attribute', component: AttributeAdd },
    { path: '/attribute/edit', name: 'Attribute', component: AttributeEdit },
    { path: '/sub-attribute/view', name: 'Sub Attribute', component: SubAttributeView },
    { path: '/sub-attribute/add', name: 'Sub Attribute', component: SubAttributeAdd },
    { path: '/sub-attribute/edit', name: 'Sub Attribute', component: SubAttributeEdit },
    { path: '/order/pending', name: 'Pending Orders', component: PendingOrder },
    { path: '/order/assign-pickup', name: 'Assigned Pickup Orders', component: AssignPickupOrder },
    { path: '/order/attheshop', name: 'Arrived at Shop Orders', component: AtTheShopOrder },
    { path: '/order/confirm', name: 'Confirmed Orders', component: ConfirmOrder },
    { path: '/order/inprocess', name: 'Inprocess Orders', component: InprocessOrder },
    { path: '/order/pickup', name: 'Pickup Orders', component: PickupOrder },
    { path: '/order/delivered', name: 'Delivered Orders', component: DeliveredOrder },
    { path: '/order/cancel', name: 'Cancel Orders', component: CancelOrder },
    { path: '/order/detail', name: 'Order Details', component: OrderDetail },
    { path: '/order/waiting', name: 'Waiting Orders', component: WaitingOrder },
    { path: '/order/ready', name: 'Ready Orders', component: ReadyOrder },
    { path: '/coupon/view', name: 'Coupon', component: CouponView },
    { path: '/coupon/add', name: 'Coupon', component: CouponAdd },
    { path: '/coupon/edit', name: 'Coupon', component: CouponEdit },
]

export default routes
