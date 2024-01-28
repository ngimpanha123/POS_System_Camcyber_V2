// ================================================================>> Core Library
import { Injectable } from '@angular/core';

// ================================================================>> Third Party Library
import { cloneDeep } from 'lodash-es';

// ================================================================>> Custom Library
import { HelpersNavigationItem } from 'helpers/components/navigation';
import { HelpersMockApiService } from 'helpers/mock-api';
import { staffNavigation } from './data';

@Injectable({ providedIn: 'root' })
export class StaffNavigation {

    private readonly _staffNavigation: HelpersNavigationItem[] = staffNavigation;

    constructor(private _helpersMockApiService: HelpersMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        this._helpersMockApiService.onGet('api/navigation/staff').reply(() => {
            return [
                200,
                {
                    default: cloneDeep(this._staffNavigation)
                },
            ];
        });
    }
}
