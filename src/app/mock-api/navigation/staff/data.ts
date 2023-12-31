/* eslint-disable */
import { HelpersNavigationItem } from 'helpers/components/navigation';

export const staffNavigation: HelpersNavigationItem[] = [

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
    //===================================>> Profile
    {
        id      : 'profile',
        title   : 'គណនី',
        type    : 'basic',
        icon    : 'mat_solid:person',
        link    : '/profile'
    },
];
