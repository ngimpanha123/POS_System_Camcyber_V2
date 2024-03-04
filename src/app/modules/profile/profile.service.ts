// ================================================================>> Core Library (Angular)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// ================================================================>> Third party Library
import { Observable } from 'rxjs';

// ================================================================>> Custom Library (Application-specific)
import { environment as env } from 'environments/environment';
import { UpdatePassword, UpdateProfile } from './profile.tyeps';


@Injectable({
    providedIn: 'root',
})
export class ProfileService {

    // Base URL for the API
    private readonly url: string = env.API_BASE_URL;

    // HTTP options with headers for sending JSON data
    private readonly httpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    // Constructor with HTTP client injection
    constructor(private http: HttpClient) { }

    // Method to update user profile information
    updateProfile(body: UpdateProfile): Observable<{ data: { access_token: string, }, message: string }> {

        // Sends a PUT request to the API endpoint for updating the profile
        return this.http.put<{ data: { access_token: string, }, message: string }>(this.url + '/profile', body, this.httpOptions);
    }

    // Method to update user password
    updatePassword(body: UpdatePassword): Observable<{ status_code: number, message: string }> {

        // Sends a PUT request to the API endpoint for updating the password
        return this.http.put<{ status_code: number, message: string }>(this.url + '/profile/update-password', body, this.httpOptions);
    }
}
