// ================================================================>> Core Library
import { Injectable }               from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';

// ================================================================>> Third party Library
import { Observable }               from 'rxjs';

// ================================================================>> Custom Library
import { environment as env }       from 'environments/environment';
import { List }                     from './dashboard.types';

@Injectable({

    providedIn: 'root',
})

export class DashboardService {

    constructor(private httpClient: HttpClient) { }

    // Function to fetch dashboard data from the backend
    list(): Observable<List> {

        return this.httpClient.get<List>(`${env.API_BASE_URL}/dashboard`, {
            
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }
}
