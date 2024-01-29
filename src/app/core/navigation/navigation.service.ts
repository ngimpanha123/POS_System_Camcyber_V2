// ================================================================>> Core Library
import { inject, Injectable }               from '@angular/core';

// ================================================================>> Third Party Library
import { HttpClient }                       from '@angular/common/http';
import { Observable, ReplaySubject, tap }   from 'rxjs';

// ================================================================>> Custom Library
import { Navigation }                       from 'app/core/navigation/navigation.types';


@Injectable({providedIn: 'root'})
export class NavigationService
{

    // Inject the HttpClient service
    private _httpClient = inject(HttpClient);

    // Create a ReplaySubject to store and broadcast navigation data
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

    /**
     * Get admin navigation data from the server.
     * Fetches navigation data from the 'api/navigation/admin' endpoint.
     * Uses HttpClient and pipes the result through tap to update the _navigation ReplaySubject.
     */

    getAdminNavigation(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/navigation/admin').pipe(
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }

    /**
     * Get staff navigation data from the server.
     * Fetches navigation data from the 'api/navigation/staff' endpoint.
     * Uses HttpClient and pipes the result through tap to update the _navigation ReplaySubject.
     */
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
