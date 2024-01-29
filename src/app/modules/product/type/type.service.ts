// ================================================================>> Core Library (Angular)
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// ================================================================>> Third-Party Library (RxJS)
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

// ================================================================>> Custom Library
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';
import { environment as env } from 'environments/environment';
import { Data, List } from './type.types';

// Injectable decorator is used to define the service as a provider
@Injectable({
    providedIn: 'root',
})

export class ProductsTypeService {

    // HttpClient is injected through the constructor
    constructor(private httpClient  : HttpClient) { }

    // LoadingSpinnerService is injected using the inject function
    private loadingSpinner          = inject(LoadingSpinnerService);

     // Method to retrieve a list of product types from the backend
     list(): Observable<List> {

        return this.httpClient.get<List>(`${env.API_BASE_URL}/products/type`, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).pipe(

            // Perform actions before and after making the HTTP request
            switchMap   ((response: List) => {
                this.loadingSpinner.open(); // Open a loading spinner before making the request
                return of(response);
            }),

            catchError  ((error) => {
                this.loadingSpinner.close(); // Close the loading spinner in case of an error
                return new Observable(observer => {
                    observer.error(error);
                    observer.complete();
                });
            }),

            tap         ((_response: List) => {
                this.loadingSpinner.close(); // Close the loading spinner after a successful response
            })
        );
    }

    // Method to create a new product type
    create  (body: { name: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.post<{ data: Data, message: string }>(`${env.API_BASE_URL}/products/type`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    // Method to update an existing product type
    update  (id: number, body: { name: string }): Observable<{ data: Data, message: string }> {
        return this.httpClient.put<{ data: Data, message: string }>(`${env.API_BASE_URL}/products/type/${id}`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    // Method to delete an existing product type
    delete  (id: number = 0): Observable<{ status_code: number, message: string }> {
        return this.httpClient.delete<{ status_code: number, message: string }>(`${env.API_BASE_URL}/products/type/${id}`, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
