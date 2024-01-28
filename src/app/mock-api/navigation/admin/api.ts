// ================================================================>> Core Library
import { Injectable }               from '@angular/core';

// ================================================================>> Third Party Library
import { cloneDeep }                from 'lodash-es';

// ================================================================>> Custom Library
import { HelpersNavigationItem }    from 'helpers/components/navigation';
import { HelpersMockApiService }    from 'helpers/mock-api';
import { adminNavigation }          from './data';

// Injectable decorator marks the service as injectable and provides it throughout the application
@Injectable({ providedIn: 'root' })
export class AdminNavigation {

    // Array to store the admin navigation items
    private readonly _adminNavigation: HelpersNavigationItem[] = adminNavigation;

    // Constructor with dependency injection of HelpersMockApiService
    constructor(private _helpersMockApiService: HelpersMockApiService) {

        // Call the method to register API response handlers
        this.registerHandlers();
    }

    // Method to register API response handlers for admin navigation
    registerHandlers(): void {

        // Register a mock API response for GET request to 'api/navigation/admin'
        this._helpersMockApiService.onGet('api/navigation/admin').reply(() => {
            
            // Return a mock response with a 200 status code and cloned admin navigation items
            return [
                200,
                {
                    default: cloneDeep(this._adminNavigation)
                },
            ];
        });
    }
}
