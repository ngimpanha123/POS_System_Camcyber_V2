// ================================================================>> Core Library
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ================================================================>> Third Party Library
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

// ================================================================>> Costom Library
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service'
import { environment as env } from 'environments/environment';
import { Data, List, RequestUser, ResponseUser, UpdatePassword } from './user.types';


@Injectable({
    providedIn: 'root',
})

export class UserService {

    constructor(private httpClient: HttpClient) { }

    // Method to retrieve a paginated list of users
    private loadingSpinner     = inject(LoadingSpinnerService);
    list(params?: { page: number, page_size: number, key?: string }): Observable<List> {
        return this.httpClient.get<List>(`${env.API_BASE_URL}/users`, { params: params }).pipe(

            switchMap((response: List) => {
                this.loadingSpinner.open();
                return of(response);
            }),
            catchError((error) => {
                this.loadingSpinner.close();
                return new Observable(observer => {
                    observer.error(error);
                    observer.complete();
                });
            }),
            tap((_response: List) => {
                this.loadingSpinner.close();
            })
        );
    }

    // Method to create a new user
    create(body: RequestUser): Observable<ResponseUser> {
        return this.httpClient.post<ResponseUser>(`${env.API_BASE_URL}/users`, body);
    }

    // Method to update an existing user
    update(id: number, body: RequestUser): Observable<ResponseUser> {
        return this.httpClient.put<ResponseUser>(`${env.API_BASE_URL}/users/${id}`, body);
    }

    // Method to delete a user by ID
    delete(id: number): Observable<{ status_code: number, message: string }> {
        return this.httpClient.delete<{ status_code: number, message: string }>(`${env.API_BASE_URL}/users/${id}`);
    }

    // Method to update the password for a user
    updatePassword(id: number, body: UpdatePassword): Observable<{ status_code: number, message: string }> {
        return this.httpClient.put<{ status_code: number, message: string }>(`${env.API_BASE_URL}/users/${id}/update-password`, body);
    }

    // Method to update the status (active/inactive) of a user
    updateStatus(id: number, body: { is_active: number }): Observable<{ statusCode: number, message: string }> {
        return this.httpClient.put<{ statusCode: number, message: string }>(`${env.API_BASE_URL}/users/${id}/change-status`, body);
    }
}
