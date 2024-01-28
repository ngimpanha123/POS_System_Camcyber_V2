// ================================================================>> Core Library
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// ================================================================>> Third party Library
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

// ================================================================>> Custom Library
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';
import { environment as env } from 'environments/environment';
import { List, ResponseOrder } from './pos.types';

@Injectable({
    providedIn: 'root',
})
export class PosService {

    constructor(private httpClient: HttpClient) { }

    private loadingSpinner = inject(LoadingSpinnerService);
    list(): Observable<List> {
        return this.httpClient.get<List>(`${env.API_BASE_URL}/pos/products`, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).pipe(
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

    create(body: { cart: string }): Observable<ResponseOrder> {
        return this.httpClient.post<ResponseOrder>(`${env.API_BASE_URL}/pos/order`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
