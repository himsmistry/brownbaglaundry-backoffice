export default [
    {
        _tag: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Users',
        to: '/user',
        icon: 'cil-group',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Customers',
                to: '/customer/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Delivery Staffs',
                to: '/delivery-staff/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Partners',
                to: '/user/view',
            }
        ]   
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Orders',
        to: '/order',
        icon: 'cil-grid',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Pending',
                to: '/order/pending',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Assigned Pickup',
                to: '/order/assign-pickup',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Inprocess',
                to: '/order/inprocess',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Picked Up',
                to: '/order/pickup',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'At The Shop',
                to: '/order/attheshop',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Waiting',
                to: '/order/waiting',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Confirmed',
                to: '/order/confirm',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Ready',
                to: '/order/ready',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Delivered',
                to: '/order/delivered',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Cancelled',
                to: '/order/cancel',
            }
        ]   
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Templates',
        to: '/template',
        icon: 'cil-envelope-letter',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Email',
                to: '/email/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Push',
                to: '/push/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'SMS',
                to: '/sms/view',
            }
        ]   
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Content',
        to: '/content',
        icon: 'cil-language',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Service Category',
                to: '/service-category/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Service Addons',
                to: '/service-addon/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Language',
                to: '/language/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Language Labels',
                to: '/label/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'CMS',
                to: '/cms/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'FAQ Category',
                to: '/faq-category/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'FAQ',
                to: '/faq/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Package',
                to: '/package/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Attribute',
                to: '/attribute/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Sub Attribute',
                to: '/sub-attribute/view',
            },
        ]   
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Transactions',
        to: '/transactions',
        icon: 'cil-tags',
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Sales',
        to: '/sales',
        icon: 'cil-chart',
    },
    /*{
        _tag: 'CSidebarNavItem',
        name: 'Coupon',
        to: '/coupon/view',
        icon: 'cil-tags',
    },*/
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Notification',
        to: '/notification',
        icon: 'cil-bell',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Send Notification',
                to: '/send-notification',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Notification Logs ',
                to: '/notification-logs',
            }
        ]   
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Tickets',
        to: '/tickets',
        icon: 'cil-send',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Contact Us',
                to: '/contact-us',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Feedback',
                to: '/feedback',
            }
        ]   
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Roles & Rights',
        to: '/access',
        icon: 'cil-check',
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'Role',
                to: '/role/view',
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Access Rights',
                to: '/access',
            }
        ]   
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Settings',
        to: '/settings',
        icon: 'cil-settings',
    },
]
