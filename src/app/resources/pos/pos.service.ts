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

    providedIn  : 'root',
})
export class PosService {

    constructor(private httpClient: HttpClient) { }

    // Injecting LoadingSpinnerService via dependency injection
    private loadingSpinner = inject(LoadingSpinnerService);

    // Method to fetch a list of products from the POS system
    list    (): Observable<List> {

        return this.httpClient.get<List>(`${env.API_BASE_URL}/pos/products`, {

            headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).pipe(

            // Using the switchMap operator to switch to a new observable (loadingSpinner.open())
            switchMap   ((response: List) => {

                this.loadingSpinner.open();         // Open the loading spinner when making the request
                return of(response);                // Returning the original response as an observable
            }),

            catchError  ((error) => {
            
                this.loadingSpinner.close();        // Close the loading spinner in case of an error

                // Returning a new observable with the error details
                return new Observable(observer => {

                    observer.error(error);
                    observer.complete();
                });
            }),

            tap         ((_response: List) => {

                this.loadingSpinner.close();        // Close the loading spinner after the request is completed (success or error)
            })
        );
    }
    // Method to create a new order in the POS system
    create(body: { cart: string }): Observable<ResponseOrder> {
        
        return this.httpClient.post<ResponseOrder>(`${env.API_BASE_URL}/pos/order`, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
