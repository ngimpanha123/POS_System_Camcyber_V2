import { Injectable } from '@angular/core';
import { HelpersNavigationItem } from 'helpers/components/navigation';
import { HelpersMockApiService } from 'helpers/mock-api';
import { cloneDeep } from 'lodash-es';
import { adminNavigation } from './data';

@Injectable({ providedIn: 'root' })
export class AdminNavigation {

    private readonly _adminNavigation: HelpersNavigationItem[] = adminNavigation;

    constructor(private _helpersMockApiService: HelpersMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        this._helpersMockApiService.onGet('api/navigation/admin').reply(() => {
            // Return the response
            return [
                200,
                {
                    default: cloneDeep(this._adminNavigation)
                },
            ];
        });
    }
}
