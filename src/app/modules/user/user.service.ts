import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'environments/environment';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { Data, List, RequestPutUser, RequestUser, ResponseUser } from './user.types';
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private httpClient: HttpClient) { }

    private loadingSpinner = inject(LoadingSpinnerService);
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

    create(body: RequestUser): Observable<ResponseUser> {
        return this.httpClient.post<ResponseUser>(env.API_BASE_URL + '/users', body);
    }

    update(id: number = 0, body: RequestPutUser): Observable<{ statusCode: number, data: Data, message: string }> {
        return this.httpClient.put<{ statusCode: number, data: Data, message: string }>(env.API_BASE_URL + '/users/' + id, body);
    }

    delete(id: number = 0): Observable<{ status_code: number, message: string }> {
        return this.httpClient.delete<{ status_code: number, message: string }>(`${env.API_BASE_URL}/users/${id}`);
    }

    updateStatus(id: number = 0, body: { is_active: number }): Observable<{ statusCode: number, message: string }> {
        return this.httpClient.put<{ statusCode: number, message: string }>(`${env.API_BASE_URL}/users/${id}/change-status`, body);
    }
}
