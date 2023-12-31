import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'environments/environment';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { Data, List } from './product.types';
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';

@Injectable({
    providedIn: 'root',
})
export class ProductService {

    constructor(private httpClient: HttpClient) { };

    setup(): Observable<{ data: { id: number, name: string }[] }> {
        return this.httpClient.get<{ data: { id: number, name: string }[] }>(`${env.API_BASE_URL}/products/setup`);
    }

    private loadingSpinner = inject(LoadingSpinnerService);
    list(params?: { page: number, limit: number, key?: string, type_id: number }): Observable<List> {
        return this.httpClient.get<List>(`${env.API_BASE_URL}/products`, { params: params }).pipe(
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

    create(body: { code: string, name: string, type_id: number, image: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.post<{ data: Data, message: string }>(`${env.API_BASE_URL}/products`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    update(id: number, body: { code: string, name: string, type_id: number, image?: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.put<{ data: Data, message: string }>(`${env.API_BASE_URL}/products/${id}`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    delete(id: number = 0): Observable<{ status_code: number, message: string }> {
        return this.httpClient.delete<{ status_code: number, message: string }>(`${env.API_BASE_URL}/products/${id}`);
    }
}
