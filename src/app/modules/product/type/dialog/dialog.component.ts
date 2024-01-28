// ================================================================>> Core Library (Angular)
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

// ================================================================>> Third-Party Libraries (Angular Material)
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// ================================================================>> Custom Libraries (Application-specific)
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { ProductsTypeService } from '../type.service';
import { Data } from '../type.types';


@Component({

    selector        : 'products-type-dialog',
    standalone      : true,
    templateUrl     : './dialog.component.html',
    imports         : [
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

    // EventEmitter to emit response data after create or update operations
    ResponseData        = new EventEmitter<Data>();

    // Form related properties
    typeForm            : UntypedFormGroup;
    saving              : boolean = false;

    // Constructor with dependency injection
    constructor(

        @Inject(MAT_DIALOG_DATA) public data: { title: string, type: Data },

        private dialogRef       : MatDialogRef<ProductsTypeDialogComponent>,
        private formBuilder     : UntypedFormBuilder,
        private snackBarService : SnackbarService,
        private typeService     : ProductsTypeService
    ) { }

    // Lifecycle hook: ngOnInit
    ngOnInit    (): void {

        // Initialize the form on component initialization
        this.ngBuilderForm();
    }

    // Method to build the form using the form builder
    ngBuilderForm   (): void {

        // Create the form group with initial values
        this.typeForm = this.formBuilder.group({

            name    : [this.data?.type?.name || null, [Validators.required]]
        });
    }

    // Method to handle form submission
    submit  () {

        // Check whether to perform create or update based on data.type
        this.data.type == null ? this.create() : this.update();
    }

    // Method to handle create operation
    create  (): void {

        // Disable dialog close while the operation is in progress
        this.dialogRef.disableClose = true;

        // Set the saving flag to true to indicate that the operation is in progress
        this.saving = true;

        // Call the typeService to create a new type
        this.typeService.create(this.typeForm.value).subscribe({

            next    : response => {

                // Update the number of products (assuming it's a property of the returned data)
                response.data.n_of_products = 0;

                // Emit the response data using the EventEmitter
                this.ResponseData.emit(response.data);

                // Close the dialog
                this.dialogRef.close();

                // Reset the saving flag
                this.saving = false;

                // Display a success snackbar
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },

            error   : (err: HttpErrorResponse) => {

                // Re-enable dialog close
                this.dialogRef.disableClose = false;

                // Reset the saving flag
                this.saving = false;

                // Handle and display errors
                this.handleErrors(err);
            }
        });
    }

    // Method to handle update operation
    update  (): void {

        // Disable dialog close while the operation is in progress
        this.dialogRef.disableClose = true;

        // Set the saving flag to true to indicate that the operation is in progress
        this.saving = true;

        // Call the typeService to update an existing type
        this.typeService.update(this.data.type.id, this.typeForm.value).subscribe({

            next    : response => {

                // Emit the response data using the EventEmitter
                this.ResponseData.emit(response.data);

                // Close the dialog
                this.dialogRef.close();

                // Reset the saving flag
                this.saving = false;

                // Display a success snackbar
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },

            error   : (err: HttpErrorResponse) => {

                // Re-enable dialog close
                this.dialogRef.disableClose = false;

                // Reset the saving flag
                this.saving = false;

                // Handle and display errors
                this.handleErrors(err);
            }
        });
    }

    // Helper method to handle and display errors
    private handleErrors(err: HttpErrorResponse): void {

        const   errors  : { field: string, message: string }[] | undefined = err.error.errors;
        let     message : string = err.error.message ?? GlobalConstants.genericError;

        if (errors && errors.length > 0) {
            
            message     = errors.map((obj) => obj.message).join(', ');
        }

        // Display error snackbar
        this.snackBarService.openSnackBar(message, GlobalConstants.error);
    }
}
