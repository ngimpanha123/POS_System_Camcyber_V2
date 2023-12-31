import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Data } from '../type.types';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { ProductsTypeService } from '../type.service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'products-type-dialog',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule
    ]
})
export class ProductsTypeDialogComponent implements OnInit {

    ResponseData = new EventEmitter<Data>();
    typeForm: UntypedFormGroup;
    saving: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { title: string, type: Data },
        private dialogRef: MatDialogRef<ProductsTypeDialogComponent>,
        private formBuilder: UntypedFormBuilder,
        private snackBarService: SnackbarService,
        private typeService: ProductsTypeService
    ) { }

    ngOnInit(): void {
        this.ngBuilderForm();
    }

    ngBuilderForm(): void {
        this.typeForm = this.formBuilder.group({
            name: [this.data?.type?.name || null, [Validators.required]]
        });
    }

    submit() {
        this.data.type == null ? this.create() : this.update();
    }

    create(): void {
        this.dialogRef.disableClose = true;
        this.saving = true;
        this.typeService.create(this.typeForm.value).subscribe({
            next: response => {
                response.data.n_of_products = 0;
                this.ResponseData.emit(response.data);
                this.dialogRef.close();
                this.saving = false;
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err: HttpErrorResponse) => {
                this.dialogRef.disableClose = false;
                this.saving = false;
                const errors: { field: string, message: string }[] | undefined = err.error.errors;
                let message: string = err.error.message ?? GlobalConstants.genericError;
                if (errors && errors.length > 0) {
                    message = errors.map((obj) => obj.message).join(', ')
                }
                this.snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }

    update(): void {
        this.dialogRef.disableClose = true;
        this.saving = true;
        this.typeService.update(this.data.type.id, this.typeForm.value).subscribe({
            next: response => {
                this.ResponseData.emit(response.data);
                this.dialogRef.close();
                this.saving = false;
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err: HttpErrorResponse) => {
                this.dialogRef.disableClose = false;
                this.saving = false;
                const errors: { field: string, message: string }[] | undefined = err.error.errors;
                let message: string = err.error.message ?? GlobalConstants.genericError;
                if (errors && errors.length > 0) {
                    message = errors.map((obj) => obj.message).join(', ')
                }
                this.snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}
