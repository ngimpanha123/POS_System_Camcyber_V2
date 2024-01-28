// ================================================================>> Core Library (Angular)
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// ================================================================>> Third-Party Libraries (Angular Material)
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

// ================================================================>> Custom Libraries (Application-specific)
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { PortraitComponent } from 'helpers/shared/portrait/portrait.component';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { Data } from '../product.types';
import { environment as env } from 'environments/environment';
import { ProductService } from '../product.service';


@Component({
    selector: 'product-dialog',
    standalone: true,
    templateUrl: './dialog.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        PortraitComponent
    ]
})
export class ProductDialogComponent implements OnInit {

    ResponseData = new EventEmitter<Data>();
    productForm: UntypedFormGroup;
    saving: boolean = false;
    src: string = 'assets/images/avatars/image-icon.jpg';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { title: string, product: Data, setup: { id: number, name: string }[] },
        private dialogRef: MatDialogRef<ProductDialogComponent>,
        private formBuilder: UntypedFormBuilder,
        private snackBarService: SnackbarService,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.data.product != null ? this.src = `${env.FILE_BASE_URL}${this.data.product.image}` : '';
        this.ngBuilderForm();
    }

    srcChange(base64: string): void {
        this.productForm.get('image').setValue(base64);
    }

    ngBuilderForm(): void {
        this.productForm = this.formBuilder.group({
            code: [this.data?.product?.code || null, [Validators.required]],
            name: [this.data?.product?.name || null, [Validators.required]],
            type_id: [this.data?.product?.type?.id || null, [Validators.required]],
            image: [null, this.data.product == null ? Validators.required : []],
            unit_price: [this.data?.product?.unit_price || null, [Validators.required]]
        });
    }

    submit() {
        this.data.product == null ? this.create() : this.update();
    }

    create(): void {
        this.dialogRef.disableClose = true;
        this.saving = true;
        this.productService.create(this.productForm.value).subscribe({
            next: response => {
                const product: Data = {
                    id: response.data.id,
                    code: response.data.code,
                    name: response.data.name,
                    image: response.data.image,
                    unit_price: response.data.unit_price,
                    created_at: response.data.created_at,
                    type: {
                        id: response.data.type_id,
                        name: this.data.setup.find(v => v.id === response.data.type_id).name ?? ''
                    }
                }
                this.ResponseData.emit(product);
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
        this.productService.update(this.data.product.id, this.productForm.value).subscribe({
            next: response => {
                const product: Data = {
                    id: response.data.id,
                    code: response.data.code,
                    name: response.data.name,
                    image: response.data.image,
                    unit_price: response.data.unit_price,
                    created_at: response.data.created_at,
                    type: {
                        id: response.data.type_id,
                        name: this.data.setup.find(v => v.id === response.data.type_id).name ?? ''
                    }
                }
                this.ResponseData.emit(product);
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
