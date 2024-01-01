import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'environments/environment';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';

@Injectable({
    providedIn: 'root',
})
export class DetailsService {

    constructor(private httpClient: HttpClient) { }

    download(id: number): Observable<{ file_base64: string, error?: string }> {
        return this.httpClient.get<{ file_base64: string, error?: string }>(`${env.API_BASE_URL}/print/order-invoice/${id}`, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
