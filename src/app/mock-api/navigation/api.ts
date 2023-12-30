import { Injectable } from '@angular/core';
import { HelpersNavigationItem } from 'helpers/components/navigation';
import { HelpersMockApiService } from 'helpers/mock-api';
import { defaultNavigation } from 'app/mock-api/navigation/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _defaultNavigation: HelpersNavigationItem[] = defaultNavigation;

    /**
     * Constructor
     */
    constructor(private _helpersMockApiService: HelpersMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._helpersMockApiService
            .onGet('api/common/navigation')
            .reply(() => {

                // Return the response
                return [
                    200,
                    {
                        default: cloneDeep(this._defaultNavigation)
                    },
                ];
            });
    }
}
