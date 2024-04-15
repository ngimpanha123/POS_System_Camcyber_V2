// ================================================================>> Core Library (Angular)
import * as core from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// ================================================================>> Third party Library 
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

// ================================================================>> Custom Library (Application-specific)
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';
import { environment as env } from 'environments/environment';
import { Data, List } from './product.types';

@core.Injectable({
    providedIn: 'root',
})

export class ProductService {

    constructor(private httpClient: HttpClient) { };

    // Method to fetch initial setup data for products
    setup(): Observable<{ data: { id: number, name: string }[] }> {
        return this.httpClient.get<{ data: { id: number, name: string }[] }>(`${env.API_BASE_URL}/products/setup`);
    }

    // Method to retrieve a paginated list of products with optional parameters
    private loadingSpinner = core.inject(LoadingSpinnerService);

    list(params?: { page: number, limit: number, key?: string, type_id: number }): Observable<List> {

        return this.httpClient.get<List>(`${env.API_BASE_URL}/products`, { params: params }).pipe(

            switchMap((response: List) => {

                // Open a loading spinner when the request is initiated
                this.loadingSpinner.open();
                return of(response);
            }),

            catchError((error) => {

                // Close the loading spinner in case of an error
                this.loadingSpinner.close();
                return new Observable(observer => {

                    observer.error(error);
                    observer.complete();
                });
            }),

            tap((_response: List) => {

                // Close the loading spinner after the response is received
                this.loadingSpinner.close();
            })
        );
    }

    // Method to create a new product
    create  (body: { code: string, name: string, type_id: number, image: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.post<{ data: Data, message: string }>(`${env.API_BASE_URL}/products`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    // Method to update an existing product
    update  (id: number, body: { code: string, name: string, type_id: number, image?: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.put<{ data: Data, message: string }>(`${env.API_BASE_URL}/products/${id}`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    // Method to delete a product by ID
    delete  (id: number = 0): Observable<{ status_code: number, message: string }> {
        return this.httpClient.delete<{ status_code: number, message: string }>(`${env.API_BASE_URL}/products/${id}`);
    }
}
