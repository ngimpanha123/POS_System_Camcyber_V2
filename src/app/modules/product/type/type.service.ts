// ================================================================>> Core Library (Angular)
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// ================================================================>> Third-Party Library (RxJS)
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

// ================================================================>> Custom Library
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';
import { environment as env } from 'environments/environment';
import { Data, List } from './type.types';


@Injectable({
    providedIn: 'root',
})
export class ProductsTypeService {

    constructor(private httpClient: HttpClient) { }

    private loadingSpinner = inject(LoadingSpinnerService);
    list(): Observable<List> {
        return this.httpClient.get<List>(`${env.API_BASE_URL}/products/type`, {
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

    create(body: { name: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.post<{ data: Data, message: string }>(`${env.API_BASE_URL}/products/type`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    update(id: number, body: { name: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.put<{ data: Data, message: string }>(`${env.API_BASE_URL}/products/type/${id}`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    delete(id: number = 0): Observable<{ status_code: number, message: string }> {
        return this.httpClient.delete<{ status_code: number, message: string }>(`${env.API_BASE_URL}/products/type/${id}`, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
