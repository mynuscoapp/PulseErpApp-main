export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  role?: string[];
  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'insights',
    type: 'group',
    icon: 'icon-navigation',
    role: ['admin', 'manager','finance'], 
    children: [
      {
        id: 'dashboard',
        title: 'Overview',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item',
        role: ['admin', 'manager','finance'],
      }
     
    ]
  },
  {
    id: 'ui-element',
    title: 'Reports',
    type: 'group',
    icon: 'icon-ui',
    role: ['admin', 'manager','finance'],
    children: [
      {
        id: 'basic',
        title: 'Orders',
        type: 'collapse',
        icon: 'feather icon-box',
        role: ['admin', 'manager','finance'],
        children: [
          {
            id: 'button',
            title: 'Invoices from Bitrix24',
            type: 'item',
            url: '/invoiceDownload',
            role: ['admin','finance'],
          },
          {
            id: 'badges',
            title: 'Orders from WooCommerce',
            type: 'item',
            url: '/wcOrderDownLoad',
            role: ['manager','finance'],
          }
        ]
      },
      {
        id: 'basic',
        title: 'Inventory',
        type: 'collapse',
        icon: 'feather icon-box',
        role: ['admin', 'manager'],
        children: [
          {
            id: 'button',
            title: 'Stock Availability',
            type: 'item',
            url: '/stockinfo',
            role: ['admin', 'manager'],
          }
        ]
      },
      {
        id: 'basic',
        title: 'Amazon Payments',
        type: 'item',
        url: '/amazonpayments',
        icon: 'feather icon-credit-card',
        classes: 'nav-item',
        role: ['admin', 'manager','finance'],
      }
  
    ]
  },
  {

    id: 'ui-element',
    title: 'Operations',
    type: 'group',
    icon: 'icon-ui',
    role: ['admin', 'manager'],
    children: [
      {
        id: 'createdeal',
        title: 'Create Order', //Changed from Create Deal to Create Order on 17-7-2025
        type: 'item',
        url: '/createdeal',
        icon: 'feather icon-home',
        classes: 'nav-item',
        role: ['admin', 'manager'],
      },
      {
        id: 'pulseusers',
        title: 'Users',
        type: 'item',
        url: '/pulseusers',
        icon: 'feather icon-user',
        classes: 'nav-item', // Added attributes for additional context
        role: ['admin', 'manager'],
      }
    ]
  },
  {

    id: 'ui-element',
    title: 'Uploads',
    type: 'group',
    icon: 'icon-ui',
    role: ['admin', 'manager'],
    children: [
      {
        id: 'amazonpaymentsupload',
        title: 'Amazon Payments Upload', //Changed from Create Deal to Create Order on 17-7-2025
        type: 'item',
        url: '/amazonpaymentsupload',
        icon: 'feather icon-home',
        classes: 'nav-item',
        role: ['admin', 'manager'],
      }
    ]
  },

  // {
  //   id: 'ui-element',
  //   title: 'UI ELEMENT',
  //   type: 'group',
  //   icon: 'icon-ui',
  //   children: [
  //     {
  //       id: 'basic',
  //       title: 'Component',
  //       type: 'collapse',
  //       icon: 'feather icon-box',
  //       children: [
  //         {
  //           id: 'button',
  //           title: 'Button',
  //           type: 'item',
  //           url: '/basic/button'
  //         },
  //         {
  //           id: 'badges',
  //           title: 'Badges',
  //           type: 'item',
  //           url: '/basic/badges'
  //         },
  //         {
  //           id: 'breadcrumb-pagination',
  //           title: 'Breadcrumb & Pagination',
  //           type: 'item',
  //           url: '/basic/breadcrumb-paging'
  //         },
  //         {
  //           id: 'collapse',
  //           title: 'Collapse',
  //           type: 'item',
  //           url: '/basic/collapse'
  //         },
  //         {
  //           id: 'tabs-pills',
  //           title: 'Tabs & Pills',
  //           type: 'item',
  //           url: '/basic/tabs-pills'
  //         },
  //         {
  //           id: 'typography',
  //           title: 'Typography',
  //           type: 'item',
  //           url: '/basic/typography'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'forms',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms-element',
  //       title: 'Form Elements',
  //       type: 'item',
  //       url: '/forms/basic',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text'
  //     },
  //     {
  //       id: 'tables',
  //       title: 'Tables',
  //       type: 'item',
  //       url: '/tables/bootstrap',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server'
  //     }
  //   ]
  // },
  // {
  //   id: 'chart-maps',
  //   title: 'Chart',
  //   type: 'group',
  //   icon: 'icon-charts',
  //   children: [
  //     {
  //       id: 'apexChart',
  //       title: 'ApexChart',
  //       type: 'item',
  //       url: 'apexchart',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart'
  //     }
  //   ]
  // },
  // {
  //   id: 'pages',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-pages',
  //   children: [
  //     {
  //       id: 'auth',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'feather icon-lock',
  //       children: [
  //         {
  //           id: 'signup',
  //           title: 'Sign up',
  //           type: 'item',
  //           url: '/auth/signup',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'signin',
  //           title: 'Sign in',
  //           type: 'item',
  //           url: '/auth/signin',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     },
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar'
  //     },
  //     {
  //       id: 'disabled-menu',
  //       title: 'Disabled Menu',
  //       type: 'item',
  //       url: 'javascript:',
  //       classes: 'nav-item disabled',
  //       icon: 'feather icon-power',
  //       external: true
  //     },
  //     {
  //       id: 'buy_now',
  //       title: 'Buy Now',
  //       type: 'item',
  //       icon: 'feather icon-book',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.com/item/datta-able-angular/',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // }
];
