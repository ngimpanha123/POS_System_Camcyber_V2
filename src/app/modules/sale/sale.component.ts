// ================================================================>> Core Library 
import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


// ================================================================>> Third-Party Library
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import FileSaver from 'file-saver';
import { MatDatepickerModule } from '@angular/material/datepicker';

// ================================================================>> Custom Library
import { SharedDetailsComponent } from 'helpers/shared/details/details.component';
import { DetailsService } from 'helpers/shared/details/details.service';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { HelpersConfirmationConfig, HelpersConfirmationService } from 'helpers/services/confirmation';
import { environment as env } from 'environments/environment';
import { Data, List } from './sale.types';
import { SaleService } from './sale.service';




@Component({
    selector: 'app-sale',
    standalone: true,
    templateUrl: './sale.component.html',
    styleUrl: './sale.component.scss',
    imports: [
        MatTableModule,
        NgClass,
        DatePipe,
        DecimalPipe,
        FormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatMenuModule,
        RouterLink
    ]
})
export class SaleComponent implements OnInit {

    private saleService = inject(SaleService);
    private snackBarService = inject(SnackbarService);
    private helpersConfirmationService = inject(HelpersConfirmationService);
    private detailsService = inject(DetailsService);

    displayedColumns: string[] = ['receipt', 'seller', 'price', 'ordered_at', 'action'];
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
        this.list(this.page, this.limit);
    }

    list(_page: number = 1, _limit: number = 10): void {
        const params: { page: number, limit: number, receipt_number?: string, from?: string, to?: string } = {
            page: _page,
            limit: _limit
        }
        if (this.receipt_number != '') {
            params.receipt_number = this.receipt_number;
        }
        if (this.from && this.to) {
            params.from = new Date(this.from).toString(),
                params.to = new Date(this.to).toString()
        }
        this.isLoading = true;
        this.saleService.list(params).subscribe({
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

    private matDialog = inject(MatDialog)
    view(row: Data): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = row;
        dialogConfig.width = "650px";
        dialogConfig.minHeight = "200px";
        dialogConfig.autoFocus = false;
        this.matDialog.open(SharedDetailsComponent, dialogConfig);
    }

    onDelete(sale: Data): void {
        // Build the config form
        const configAction: HelpersConfirmationConfig = {
            title: `Remove <strong> ${sale.receipt_number} </strong>`,
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
                this.saleService.delete(sale.id).subscribe({
                    next: (response: { status_code: number, message: string }) => {
                        this.dataSource.data = this.dataSource.data.filter((v: Data) => v.id != sale.id);
                        this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
                    },
                    error: (err: HttpErrorResponse) => {
                        this.snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
                    }
                });
            }
        });
    }

    downloading: boolean = false;
    print(row: Data) {
        this.downloading = true;
        this.detailsService.download(row.receipt_number).subscribe({
            next: res => {
                this.downloading = false;
                let blob = this.b64toBlob(res.file_base64, 'application/pdf');
                FileSaver.saveAs(blob, 'Invoice-' + row.receipt_number + '.pdf');
            },
            error: (err: HttpErrorResponse) => {
                this.snackBarService.openSnackBar(err.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }
    // =================================>> Convert base64 to blob
    b64toBlob(b64Data: string, contentType: string, sliceSize?: number) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
}
