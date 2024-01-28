// ================================================================>> Core Library (Angular)
import { Component, OnInit, inject }    from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { HttpErrorResponse }            from '@angular/common/http';

// ================================================================>> Third-Party Libraries
import { MatProgressSpinnerModule }     from '@angular/material/progress-spinner';

// ================================================================>> Custom Libraries (Application-specific)
import { GlobalConstants }              from 'helpers/shared/global-constants';
import { SnackbarService }              from 'helpers/services/snack-bar/snack-bar.service';
import { DashboardService }             from './dashboard.service';
import { Data, List }                   from './dashboard.types';

@Component({

    selector        : 'app-dashboard',
    standalone      : true,
    imports         : [CommonModule, MatProgressSpinnerModule],
    templateUrl     : './dashboard.component.html',
    styleUrl        : './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

    loading     : boolean = false;                          // Flag to indicate whether data is being loaded
    data        : Data;                                     // Variable to store the dashboard data
    private snackBarService = inject(SnackbarService);      // Inject SnackbarService for displaying snack bar messages

    // Constructor where DashboardService is injected
    constructor(private dashboardService: DashboardService) { };

    // Lifecycle hook: ngOnInit is called when the component is initialized
    ngOnInit(): void {

        this.loading = true;        // Set loading flag to true

        // Call the list method of DashboardService to fetch dashboard data
        this.dashboardService.list().subscribe({

            next    : (response: List) => {

                // Handle the successful response
                this.data       = response.data;            // Assign the received data to the 'data' variable
                this.loading    = false;                    // Set loading flag to false
            },

            error   : (err: HttpErrorResponse) => {
                    
                // Handle errors in fetching dashboard data
                this.snackBarService.openSnackBar(err.error?.message ?? GlobalConstants.genericError, GlobalConstants.error);
                this.loading    = false; // Set loading flag to false
            }
        })
    }
}
