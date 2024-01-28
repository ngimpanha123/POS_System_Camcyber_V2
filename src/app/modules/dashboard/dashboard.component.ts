// ================================================================>> Core Library (Angular)
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// ================================================================>> Third-Party Libraries
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// ================================================================>> Custom Libraries (Application-specific)
import { GlobalConstants } from 'helpers/shared/global-constants';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { DashboardService } from './dashboard.service';
import { Data, List } from './dashboard.types';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    loading: boolean = false;
    data: Data;
    private snackBarService = inject(SnackbarService);
    constructor(private dashboardService: DashboardService) { };

    ngOnInit(): void {
        this.loading = true;
        this.dashboardService.list().subscribe({
            next: (response: List) => {
                this.data = response.data;
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.snackBarService.openSnackBar(err.error?.message ?? GlobalConstants.genericError, GlobalConstants.error);
                this.loading = false;
            }
        })
    }
}
