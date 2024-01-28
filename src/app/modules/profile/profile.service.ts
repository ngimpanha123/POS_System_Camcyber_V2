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

    private readonly url: string = env.API_BASE_URL;
    private readonly httpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    constructor(private http: HttpClient) { }

    updateProfile(body: UpdateProfile): Observable<{ access_token: string, message: string }> {
        return this.http.put<{ access_token: string, message: string }>(this.url + '/profile', body, this.httpOptions);
    }

    updatePassword(body: UpdatePassword): Observable<{ status_code: number, message: string }> {
        return this.http.put<{ status_code: number, message: string }>(this.url + '/profile/update-password', body, this.httpOptions);
    }
}
