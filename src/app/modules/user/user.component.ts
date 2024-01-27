// ================================================================>> Core Library
import * as core from '@angular/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// ================================================================>> Third Party  Library
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { environment as env } from 'environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

// ================================================================>> Custom  Library
import { HelpersConfirmationConfig, HelpersConfirmationService } from 'helpers/services/confirmation';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { UserService } from './user.service';
import { List, Data } from './user.types';
import { UpdatePasswordDialogComponent, UserDialogComponent } from './dialog/dialog.component';

@core.Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    imports: [
        MatTableModule,
        NgIf,
        NgClass,
        DatePipe,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatMenuModule,
        UiSwitchModule
    ]
})
export class UserComponent implements core.OnInit {

    private userService = core.inject(UserService);
    private snackBarService = core.inject(SnackbarService);
    private helpersConfirmationService = core.inject(HelpersConfirmationService);

    displayedColumns: string[] = ['profile', 'contact', 'last_activity', 'status', 'action'];
    dataSource: MatTableDataSource<Data> = new MatTableDataSource<Data>([]);
    fileUrl: string = env.FILE_BASE_URL;
    total: number = 10;
    limit: number = 10;
    page: number = 1;
    key: string = '';
    isLoading: boolean = false;

    ngOnInit(): void {
        this.list(this.page, this.limit);
    }

    list(_page: number = 1, _page_size: number = 10): void {
        const params: { page: number, page_size: number, key?: string } = {
            page: _page,
            page_size: _page_size
        }
        if (this.key != '') {
            params.key = this.key;
        }
        this.isLoading = true;
        this.userService.list(params).subscribe({
            next: (response: List) => {
                this.dataSource.data = response.data;
                this.total = response.pagination.total_items;
                this.limit = response.pagination.per_page;
                this.page = response.pagination.current_page;
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                this.snackBarService.openSnackBar(err?.error?.message ?? GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    onPageChanged(event: PageEvent): void {
        if (event && event.pageSize) {
            this.limit = event.pageSize;
            this.page = event.pageIndex + 1;
            this.list(this.page, this.limit);
        }
    }

    private matDialog = core.inject(MatDialog)
    create(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            title: 'បង្កើតអ្នកប្រើប្រាស់',
            user: null
        };
        dialogConfig.width = "700px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        const dialogRef = this.matDialog.open(UserDialogComponent, dialogConfig);
        dialogRef.componentInstance.ResponseData.subscribe((user: Data) => {
            const data = this.dataSource.data;
            data.unshift(user);
            this.dataSource.data = data;
        });
    }
    update(row: Data): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            title: 'កែប្រែអ្នកប្រើប្រាស់',
            user: row
        };
        dialogConfig.width = "700px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        const dialogRef = this.matDialog.open(UserDialogComponent, dialogConfig);
        dialogRef.componentInstance.ResponseData.subscribe((user: Data) => {
            const index = this.dataSource.data.indexOf(row);
            const data = this.dataSource.data;
            data[index] = user;
            this.dataSource.data = data;
        });
    }

    updatePassword(user: Data): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = user;
        dialogConfig.width = "650px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        this.matDialog.open(UpdatePasswordDialogComponent, dialogConfig);
    }

    onDelete(user: Data): void {
        // Build the config form
        const configAction: HelpersConfirmationConfig = {
            title: `Remove <strong> ${user.name} </strong>`,
            message: 'Are you sure you want to remove this user permanently? <span class="font-medium">This action cannot be undone!</span>',
            icon: ({
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            }),
            actions: {
                confirm: {
                    show: true,
                    label: 'Remove',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },
            dismissible: true,
        };
        // Open the dialog and save the reference of it
        const dialogRef = this.helpersConfirmationService.open(configAction);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result: string) => {
            if (result && typeof result === 'string' && result === 'confirmed') {
                this.userService.delete(user.id).subscribe({
                    next: (response: { status_code: number, message: string }) => {
                        this.dataSource.data = this.dataSource.data.filter((v: Data) => v.id != user.id);
                        this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
                    },
                    error: (err: HttpErrorResponse) => {
                        this.snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                    }
                });
            }
        });
    }

    //=============================================>> Status
    onChange(status: boolean, user: Data): void {
        const body = {
            is_active: status ? 1 : 0
        };
        this.userService.updateStatus(user.id, body).subscribe({
            next: (response) => {
                const index = this.dataSource.data.indexOf(user);
                const data = this.dataSource.data;
                data[index].is_active = status ? 1 : 0;
                this.dataSource.data = data;
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err) => {
                this.snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        })
    }
}
