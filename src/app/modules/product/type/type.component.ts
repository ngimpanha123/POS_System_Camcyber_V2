import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ProductsTypeService } from './type.service';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { HelpersConfirmationConfig, HelpersConfirmationService } from 'helpers/services/confirmation';
import { environment as env } from 'environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductsTypeDialogComponent } from './dialog/dialog.component';
import { Data, List } from './type.types';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from 'helpers/shared/global-constants';

@Component({
    selector: 'products-type',
    standalone: true,
    templateUrl: './type.component.html',
    styleUrl: './type.component.scss',
    imports: [
        MatTableModule,
        NgClass,
        DecimalPipe,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
    ]
})
export class ProductsTypeComponent implements OnInit {

    private typeService = inject(ProductsTypeService);
    private snackBarService = inject(SnackbarService);
    private helpersConfirmationService = inject(HelpersConfirmationService);

    displayedColumns: string[] = ['no', 'name', 'n_of_products', 'action'];
    dataSource: MatTableDataSource<Data> = new MatTableDataSource<Data>([]);
    fileUrl: string = env.FILE_BASE_URL;
    total: number = 10;
    limit: number = 10;
    page: number = 1;
    from: Date;
    to: Date;
    receipt_number: string = '';
    isLoading: boolean = false;

    ngOnInit(): void {
        this.typeService.list().subscribe({
            next: (response: List) => {
                this.dataSource.data = response.data;
                this.isLoading = false;

            },
            error: (err: HttpErrorResponse) => {
                this.snackBarService.openSnackBar(err?.error?.message ?? GlobalConstants.genericError, GlobalConstants.error);
                this.isLoading = false;
            }
        });
    }

    private matDialog = inject(MatDialog);
    create(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            title: 'បង្កើតប្រភេទ',
            type: null
        };
        dialogConfig.width = "650px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        const dialogRef = this.matDialog.open(ProductsTypeDialogComponent, dialogConfig);
        dialogRef.componentInstance.ResponseData.subscribe((type: Data) => {
            const data = this.dataSource.data;
            data.push({
                id: type.id,
                name: type.name,
                n_of_products: type.n_of_products
            });
            data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            this.dataSource.data = data;
        });
    }

    update(row: Data): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            title: 'កែប្រែប្រភេទ',
            type: row
        };
        dialogConfig.width = "650px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        const dialogRef = this.matDialog.open(ProductsTypeDialogComponent, dialogConfig);
        dialogRef.componentInstance.ResponseData.subscribe((type: Data) => {
            const index = this.dataSource.data.indexOf(row);
            this.dataSource.data[index].name = type.name;
        });
    }

    onDelete(type: Data): void {
        // Build the config form
        const configAction: HelpersConfirmationConfig = {
            title: `Remove <strong> ${type.name} </strong>`,
            message: 'Are you sure you want to remove this receipt number permanently? <span class="font-medium">This action cannot be undone!</span>',
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
                this.typeService.delete(type.id).subscribe({
                    next: (response: { status_code: number, message: string }) => {
                        this.dataSource.data = this.dataSource.data.filter((v: Data) => v.id != type.id);
                        this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
                    },
                    error: (err: HttpErrorResponse) => {
                        this.snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                    }
                });
            }
        });
    }

    getTotal(): number {
        return this.dataSource.data.map(t => t.n_of_products).reduce((acc, value) => Number(acc) + Number(value), 0);
    }
}
