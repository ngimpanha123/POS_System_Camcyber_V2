// ================================================================>> Core Library
import { inject, Injectable } from '@angular/core';

// ================================================================>> Third Party Library
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';

// ================================================================>> Custom Library
import { Navigation } from 'app/core/navigation/navigation.types';


@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getAdminNavigation(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/navigation/admin').pipe(
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }

    getStaffNavigation(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/navigation/staff').pipe(
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }
}
