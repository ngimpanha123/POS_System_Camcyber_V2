// ================================================================>> Core Library (Angular)
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ================================================================>> Third-Party Library (RxJS)
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

// ================================================================>> Custom Library
import { List } from './sale.types';
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';
import { environment as env } from 'environments/environment';


@Injectable({
    providedIn: 'root',
})
export class SaleService {

    // Constructor to inject dependencies, including the HttpClient for making HTTP requests
    constructor(private httpClient: HttpClient) { }

    private loadingSpinner = inject(LoadingSpinnerService);
    list    (params?: { page: number, limit: number, receipt_number?: string, from?: string, to?: string }): Observable<List> {
        return this.httpClient.get<List>(`${env.API_BASE_URL}/sales`, { params: params }).pipe(

            switchMap   ((response      : List) => {

                this.loadingSpinner.open();
                return of(response);
            }),

            catchError  ((error) => {
                
                this.loadingSpinner.close();
                return new Observable(observer => {
                    observer.error(error);
                    observer.complete();
                });
            }),

            tap         ((_response     : List) => {
                this.loadingSpinner.close();
            })
        );
    }

    delete  (id: number = 0): Observable<{ status_code: number, message: string }> {
        return this.httpClient.delete<{ status_code: number, message: string }>(`${env.API_BASE_URL}/sales/${id}`);
    }
}
