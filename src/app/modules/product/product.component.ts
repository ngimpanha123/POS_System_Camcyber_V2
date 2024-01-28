// ================================================================>> Core Library (Angular)
import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; 

// ================================================================>> Angular Material Modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

// ================================================================>> Custom Library (Application-specific)
import { GlobalConstants } from 'helpers/shared/global-constants';                      // Custom import for global constants
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service'; 
import { HelpersConfirmationConfig, HelpersConfirmationService } from 'helpers/services/confirmation';
import { environment as env } from 'environments/environment'; 
import { Data, List } from './product.types'; 
import { ProductService } from './product.service'; 
import { ProductDialogComponent } from './dialog/dialog.component';                     // Assuming this is a custom dialog component related to products


@Component({
    selector: 'app-product',
    standalone: true,
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
    imports: [
        MatTableModule,
        NgClass,
        DatePipe,
        DecimalPipe,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatMenuModule
    ]
})
export class ProductComponent implements OnInit {

    private productService = inject(ProductService);
    private snackBarService = inject(SnackbarService);
    private helpersConfirmationService = inject(HelpersConfirmationService);

    displayedColumns: string[] = ['product', 'price', 'created', 'action'];
    dataSource: MatTableDataSource<Data> = new MatTableDataSource<Data>([]);
    fileUrl: string = env.FILE_BASE_URL;
    setup: { id: number, name: string }[] = [];
    total: number = 10;
    limit: number = 10;
    page: number = 1;
    key: string = '';
    type_id: number = 0;
    isLoading: boolean = false;

    ngOnInit(): void {
        this.initSetup();
        this.list(this.page, this.limit);
    }

    initSetup(): void {
        this.productService.setup().subscribe({
            next: response => this.setup = response.data,
            error: err => console.log(err)
        });
    }

    list(_page: number = 1, _limit: number = 10): void {
        const params: { page: number, limit: number, key?: string, type_id: number } = {
            page: _page,
            limit: _limit,
            type_id: this.type_id
        }
        if (this.key != '') {
            params.key = this.key;
        }

        this.isLoading = true;
        this.productService.list(params).subscribe({
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

    private matDialog = inject(MatDialog);
    create(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            title: 'បង្កើតផលិតផល',
            product: null,
            setup: this.setup
        };
        dialogConfig.width = "850px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        const dialogRef = this.matDialog.open(ProductDialogComponent, dialogConfig);
        dialogRef.componentInstance.ResponseData.subscribe((product: Data) => {
            const data = this.dataSource.data;
            data.unshift(product);
            this.dataSource.data = data;
        });
    }
    update(row: Data): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            title: 'កែប្រែផលិតផល',
            product: row,
            setup: this.setup
        };
        dialogConfig.width = "850px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        const dialogRef = this.matDialog.open(ProductDialogComponent, dialogConfig);
        dialogRef.componentInstance.ResponseData.subscribe((product: Data) => {
            const index = this.dataSource.data.indexOf(row);
            const data = this.dataSource.data;
            data[index] = product;
            this.dataSource.data = data;
        });
    }

    onDelete(product: Data): void {
        // Build the config form
        const configAction: HelpersConfirmationConfig = {
            title: `Remove <strong> ${product.name} </strong>`,
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
                this.productService.delete(product.id).subscribe({
                    next: (response: { status_code: number, message: string }) => {
                        this.dataSource.data = this.dataSource.data.filter((v: Data) => v.id != product.id);
                        this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
                    },
                    error: (err: HttpErrorResponse) => {
                        this.snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                    }
                });
            }
        });
    }
}
