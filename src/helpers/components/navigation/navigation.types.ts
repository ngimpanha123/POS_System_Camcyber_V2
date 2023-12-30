import { IsActiveMatchOptions, Params, QueryParamsHandling } from '@angular/router';

export interface HelpersNavigationItem {
    id?: string;
    title?: string;
    subtitle?: string;
    type:
    | 'basic'
    | 'collapsable'
    | 'group';
    hidden?: (item: HelpersNavigationItem) => boolean;
    active?: boolean;
    disabled?: boolean;
    tooltip?: string;
    link?: string;
    fragment?: string;
    preserveFragment?: boolean;
    queryParams?: Params | null;
    queryParamsHandling?: QueryParamsHandling | null;
    externalLink?: boolean;
    target?:
    | '_blank'
    | '_self'
    | '_parent'
    | '_top'
    | string;
    exactMatch?: boolean;
    isActiveMatchOptions?: IsActiveMatchOptions;
    function?: (item: HelpersNavigationItem) => void;
    classes?: {
        title?: string;
        subtitle?: string;
        icon?: string;
        wrapper?: string;
    };
    icon?: string;
    badge?: {
        title?: string;
        classes?: string;
    };
    children?: HelpersNavigationItem[];
    meta?: any;
}

export type HelpersNavigationAppearance = 'default'

export type HelpersNavigationMode = 'over' | 'side';

export type HelpersNavigationPosition = 'left' | 'right';
