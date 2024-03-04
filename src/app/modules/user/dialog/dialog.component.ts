// ================================================================>> Core Library
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

// ================================================================>> Third Party Library
// Angular material >>
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { UiSwitchModule } from 'ngx-ui-switch';

// ================================================================ Costom Library
import { GlobalConstants } from 'helpers/shared/global-constants';
import { PortraitComponent } from 'helpers/shared/portrait/portrait.component';
import { Data, RequestUser } from '../user.types';
import { UserService } from '../user.service';
import { environment as env } from 'environments/environment';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';


@Component({
    selector: 'user-dialog',
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
        PortraitComponent,
        UiSwitchModule
    ]
})

export class UserDialogComponent implements OnInit {

    // Event emitter for passing data back to the parent component
    ResponseData = new EventEmitter<Data>();

    userForm: UntypedFormGroup;                                     // Form group for user data
    saving: boolean = false;                                      // Flag to indicate if the form is currently being saved
    src: string = 'assets/images/avatars/image-icon.jpg';      // Default image source for the avatar

    typesEnum: { id: number, name: string }[] = [
        {
            id: 1,
            name: "Admin"
        },
        {
            id: 2,
            name: "Staff"
        }
    ];

    // Constructor to inject dependencies
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { title: string, user: Data },
        private dialogRef: MatDialogRef<UserDialogComponent>,
        private formBuilder: UntypedFormBuilder,
        private snackBarService: SnackbarService,
        private userService: UserService
    ) { }

    // Initialization logic
    ngOnInit(): void {

        // Set the avatar source if user data is available
        this.data.user != null ? this.src = `${env.FILE_BASE_URL}${this.data.user.avatar}` : '';

        // Build the form
        this.ngBuilderForm();
    }

    // Handle avatar source change
    srcChange(base64: string): void {
        this.userForm.get('avatar').setValue(base64);
    }

    // Build the user form
    ngBuilderForm(): void {
        this.userForm = this.formBuilder.group({
            name: [this.data?.user?.name || null, [Validators.required]],
            phone: [this.data?.user?.phone || null, [Validators.required]],
            email: [this.data?.user?.email || null, [Validators.required]],
            type_id: [this.data?.user?.type?.id || null, [Validators.required]],
            avatar: [null, this.data.user == null ? Validators.required : []],
            password: [null, this.data.user == null ? Validators.required : []]
        });
    }

    // Submit the form (create or update user)
    submit() {
        this.data.user == null ? this.create() : this.update();
    }

    // Create a new user
    create(): void {
        this.dialogRef.disableClose = true;
        this.saving = true;

        this.userService.create(this.userForm.value).subscribe({

            next: response => {
                this.ResponseData.emit(response.data);
                this.dialogRef.close();
                this.saving = false;
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err: HttpErrorResponse) => {
                this.dialogRef.disableClose = false;
                this.saving = false;
                const errors: { type: string, message: string }[] | undefined = err.error?.errors;
                let message: string = err.error?.message ?? GlobalConstants.genericError;
                if (errors && errors.length > 0) {
                    message = errors.map((obj) => obj.message).join(', ')
                }
                this.snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }

    // Update an existing user
    update(): void {
        this.dialogRef.disableClose = true;
        this.saving = true;

        const body: RequestUser = {
            name: this.userForm.value.name,
            phone: this.userForm.value.phone,
            email: this.userForm.value.email,
            type_id: this.userForm.value.type_id,
            avatar: this.userForm.value.avatar
        }
        this.userService.update(this.data.user.id, body).subscribe({
            next: response => {
                this.ResponseData.emit(response.data);
                this.dialogRef.close();
                this.saving = false;
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err: HttpErrorResponse) => {
                this.dialogRef.disableClose = false;
                this.saving = false;
                const errors: { type: string, message: string }[] | undefined = err.error?.errors;
                let message: string = err.error?.message ?? GlobalConstants.genericError;

                if (errors && errors.length > 0) {
                    message = errors.map((obj) => obj.message).join(', ')
                }
                this.snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}

// Component for updating user password
@Component({
    selector: 'update-password-dialog',
    standalone: true,
    template: `

    <div mat-dialog-title>
        <span class="text-xl">ប្តូរពាក្យសម្ងាត់នៃ {{user.name}}</span>
    </div>
    <mat-dialog-content class="border-t">
        <form [formGroup]="passwordForm" class="md-form-field-appearance-outline">
            <mat-form-field appearance="outline" class="w-full mt-4">
                <mat-label>ពាក្យសម្ងាត់</mat-label>
                <input matInput type="password" [formControlName]="'password'" #passwordField>
                <button mat-icon-button type="button"
                    (click)="passwordField.type === 'password' ? passwordField.type = 'text' : passwordField.type = 'password'"
                    matSuffix>
                    <mat-icon class="icon-size-5" *ngIf="passwordField.type === 'password'"
                        [svgIcon]="'heroicons_solid:eye'"></mat-icon>
                    <mat-icon class="icon-size-5" *ngIf="passwordField.type === 'text'"
                        [svgIcon]="'heroicons_solid:eye-slash'"></mat-icon>
                </button>
                <mat-error>
                    សូមបញ្ចូលពាក្យសម្ងាត់
                </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="w-full">
                <mat-label>បញ្ជាក់ពាក្យសម្ងាត់</mat-label>
                <input matInput type="password" [formControlName]="'confirm_password'" #confirmPasswordField>
                <button mat-icon-button type="button"
                    (click)="confirmPasswordField.type === 'password' ? confirmPasswordField.type = 'text' : confirmPasswordField.type = 'password'"
                    matSuffix>
                    <mat-icon class="icon-size-5" *ngIf="confirmPasswordField.type === 'password'"
                        [svgIcon]="'heroicons_solid:eye'"></mat-icon>
                    <mat-icon class="icon-size-5" *ngIf="confirmPasswordField.type === 'text'"
                        [svgIcon]="'heroicons_solid:eye-slash'"></mat-icon>
                </button>
                <mat-error>
                    សូមបញ្ចូលបញ្ជាក់ពាក្យសម្ងាត់
                </mat-error>
            </mat-form-field>
        </form>
    </mat-dialog-content>
    <mat-dialog-actions class="flex items-center justify-end gap-2">
        <button class="helpers-mat-button-md" mat-flat-button (click)="submit()" [disabled]="passwordForm.invalid || saving">
            <span *ngIf="!passwordForm.disabled">រក្សាទុក</span>
            <mat-progress-spinner *ngIf="passwordForm.disabled" [diameter]="24" [mode]="'indeterminate'"></mat-progress-spinner>
        </button>
        <button class="helpers-mat-button-md helpers-mat-button-red" [disabled]="saving" mat-flat-button [mat-dialog-close]="false">
            <span>បោះបង់</span>
        </button>
    </mat-dialog-actions>

    `,
    styles: ``,
    imports: [
        NgIf,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule
    ]
})

export class UpdatePasswordDialogComponent implements OnInit {

    // Form group for password change
    passwordForm: UntypedFormGroup;

    // Flag to indicate if the form is currently being saved
    saving: boolean = false;

    // Constructor to inject dependencies
    constructor(
        @Inject(MAT_DIALOG_DATA) public user: Data,
        private dialogRef: MatDialogRef<UpdatePasswordDialogComponent>,
        private formBuilder: UntypedFormBuilder,
        private snackBarService: SnackbarService,
        private userService: UserService
    ) { }

    // Initialization logic
    ngOnInit(): void {
        this.ngBuilderForm();
    }

    // Build the password change form
    ngBuilderForm(): void {
        this.passwordForm = this.formBuilder.group({
            password: [null, [Validators.required]],
            confirm_password: [null, [Validators.required]]
        });
    }

    // Submit the form to update password
    submit(): void {
        this.dialogRef.disableClose = true;
        this.saving = true;

        this.userService.updatePassword(this.user.id, this.passwordForm.value).subscribe({
            next: response => {
                this.dialogRef.close();
                this.saving = false;
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err: HttpErrorResponse) => {
                this.dialogRef.disableClose = false;
                this.saving = false;
                const errors: { type: string, message: string }[] | undefined = err.error?.errors;
                let message: string = err.error?.message ?? GlobalConstants.genericError;
                if (errors && errors.length > 0) {
                    message = errors.map((obj) => obj.message).join(', ')
                }
                this.snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}
