import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'environments/environment';
import { Observable } from 'rxjs';
import { List } from './dashboard.types';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {

    constructor(private httpClient: HttpClient) { }

    list(): Observable<List> {
        return this.httpClient.get<List>(`${env.API_BASE_URL}/dashboard`, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
