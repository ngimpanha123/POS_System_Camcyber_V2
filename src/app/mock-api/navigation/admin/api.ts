// ================================================================>> Core Library
import { Injectable } from '@angular/core';

// ================================================================>> Third Party Library
import { cloneDeep } from 'lodash-es';

// ================================================================>> Custom Library
import { HelpersNavigationItem } from 'helpers/components/navigation';
import { HelpersMockApiService } from 'helpers/mock-api';
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
