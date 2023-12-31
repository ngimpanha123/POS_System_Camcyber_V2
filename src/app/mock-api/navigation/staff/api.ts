import { Injectable } from '@angular/core';
import { HelpersNavigationItem } from 'helpers/components/navigation';
import { HelpersMockApiService } from 'helpers/mock-api';
import { cloneDeep } from 'lodash-es';
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
