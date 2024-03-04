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

    download(id: number): Observable<{ statsu_code: number, data: string }> {
        return this.httpClient.get<{ statsu_code: number, data: string }>(`${env.API_BASE_URL}/print/order-invoice/${id}`, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
