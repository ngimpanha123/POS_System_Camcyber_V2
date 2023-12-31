import { HelpersNavigationItem } from 'helpers/components/navigation';

export const adminNavigation: HelpersNavigationItem[] = [

    //===================================>> Dashboard
    {
        id      : 'dashboard',
        title   : 'ផ្ទាំងព័ត៌មាន',
        type    : 'basic',
        icon    : 'mat_solid:dashboard',
        link    : '/dashboard'
    },
    //===================================>> POS
    {
        id      : 'pos',
        title   : 'ការបញ្ជាទិញ',
        type    : 'basic',
        icon    : 'mat_solid:desktop_mac',
        link    : '/pos',
    },
    //===================================>> Sale
    {
        id      : 'sale',
        title   : 'ការលក់',
        type    : 'basic',
        icon    : 'mat_solid:shopping_cart',
        link    : '/sales',
    },
    //===================================>> Product
    {
        id       : 'product',
        title    : 'ផលិតផល',
        type     : 'collapsable',
        icon     : 'mat_solid:shopping_basket',
        children : [
            {
                id       : 'all',
                title    : 'ទាំងអស់',
                type     : 'basic',
                link     : 'products'
            },
            {
                id      : 'type',
                title   : 'ប្រភេទ',
                type    : 'basic',
                link    : 'products/type'
            }
        ],
    },
    //===================================>> User
    {
        id      : 'user',
        title   : 'អ្នកប្រើប្រាស់',
        type    : 'basic',
        icon    : 'mat_solid:people_alt',
        link    : '/users',
    },
    //===================================>> Profile
    {
        id      : 'profile',
        title   : 'គណនី',
        type    : 'basic',
        icon    : 'mat_solid:person',
        link    : '/profile'
    },
];
