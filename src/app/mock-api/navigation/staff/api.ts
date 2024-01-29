// ================================================================>> Core Library
import { Injectable }               from '@angular/core';

// ================================================================>> Third Party Library
import { cloneDeep }                from 'lodash-es';

// ================================================================>> Custom Library
import { HelpersNavigationItem }    from 'helpers/components/navigation';
import { HelpersMockApiService }    from 'helpers/mock-api';
import { staffNavigation }          from './data';

@Injectable({ providedIn: 'root' })
export class StaffNavigation {

  // Array to store the staff navigation items
  private readonly _staffNavigation: HelpersNavigationItem[] = staffNavigation;

  // Constructor with dependency injection of HelpersMockApiService
  constructor(private _helpersMockApiService: HelpersMockApiService) {
        // Call the method to register API response handlers
        this.registerHandlers();
  }

  // Method to register API response handlers for staff navigation
  registerHandlers(): void {

    // Register a mock API response for GET request to 'api/navigation/staff'
    this._helpersMockApiService.onGet('api/navigation/staff').reply(() => {

      // Return a mock response with a 200 status code and cloned staff navigation items
      return [
        
        200,
        {
          default: cloneDeep(this._staffNavigation)
        },
      ];
    });
  }
}
