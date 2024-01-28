
// ================================================================>> Core Library
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// ================================================================>> Third Party Library
import { Observable, ReplaySubject, of, switchMap } from 'rxjs';

// ================================================================>> Costom Library
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Login } from './auth.types';
import { environment as env } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _baseUrl: string = env.API_BASE_URL;
    private _authenticated: boolean = false;
    private _token: ReplaySubject<{ token: string }> = new ReplaySubject<{ token: string }>(1);

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
    ) { }


    /* -------------------------------------------------------------------------- */
    /*  @ Setter & getter for access token
    /* -------------------------------------------------------------------------- */
    set accessToken(token: string) {
        console.log(token)
        localStorage.setItem('accessToken', token);
    }
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    login(credentials: { username: string, password: string }): Observable<Login> {

        return this._httpClient.post(`${this._baseUrl}/auth/login`, credentials).pipe(
            switchMap((response: Login) => {
                this.accessToken = response.access_token;
                // Store the user on the user service
                this._userService.user = response.user;
                // Return a new observable with the response
                return of(response);
            }),
        );
    }


    logout(): Observable<boolean> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        // Set the authenticated flag to false
        this._authenticated = false;
        // Return the observable
        return of(true);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        return of(true);
    }
}
