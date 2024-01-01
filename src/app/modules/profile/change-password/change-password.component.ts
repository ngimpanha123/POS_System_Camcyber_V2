import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { ProfileService } from '../profile.service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'profile-change-password',
    standalone: true,
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ]
})
export class ChangePasswordComponent implements OnInit {

    passwordForm: UntypedFormGroup;
    saving: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private snackBarService: SnackbarService,
        private profileService: ProfileService
    ) { }

    ngOnInit(): void {
        this.ngBuilderForm();
    }

    ngBuilderForm(): void {
        this.passwordForm = this.formBuilder.group({
            current_password: [null, [Validators.required]],
            new_password: [null, [Validators.required]],
            confirm_password: [null, [Validators.required]]
        });
    }

    submit(): void {
        this.passwordForm.disable();
        this.profileService.updatePassword(this.passwordForm.value).subscribe({
            next: response => {
                this.passwordForm.enable();
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err: HttpErrorResponse) => {
                this.passwordForm.enable();
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
