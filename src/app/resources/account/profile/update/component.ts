// ================================================================================>> Core Library
import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Decoder
import jwt_decode from 'jwt-decode';

// ================================================================================>> Custom Library
// Core
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

// Helper
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { PortraitComponent } from 'helpers/shared/portrait/portrait.component';

// Local
import { ProfileService } from '../profile.service';

@Component({
    selector: 'update-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogModule, MatDividerModule, MatFormFieldModule, PortraitComponent],
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class UpdateProfileComponent {
    @Input() user: any;
    @Input() src: string = this.dialogData?.src;
    profile: UntypedFormGroup;
    loading: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        private readonly dialogRef: MatDialogRef<UpdateProfileComponent>,
        private readonly formBuilder: UntypedFormBuilder,
        private readonly accountService: ProfileService,
        private readonly snackBarService: SnackbarService,
        private readonly userService: UserService
    ) { }

    ngOnInit(): void {
        this.ngBuilderForm();
    }

    ngBuilderForm(): void {
        this.profile = this.formBuilder.group({
            avatar: [null],
            name: [this.dialogData?.user.name, Validators.required],
            email: [this.dialogData?.user.email, Validators.required],
            phone: [this.dialogData?.user.phone, Validators.required]
        });
    }
    
    private usernameValidator(control: AbstractControl): { [key: string]: any } | null {
        const forbidden = /[^\w]/.test(control.value);
        return forbidden ? { 'forbiddenUsername': { value: control.value } } : null;
    }
    
    srcChange(base64: string): void {
        this.profile.get('avatar').setValue(base64);
    }

    submit(): void {
        this.profile.disable();
        this.loading = true;
        this.accountService.updateProfile(this.profile.value).subscribe({
            next: (response) => {
                this.loading = false;
                const tokenPayload: { exp: number, iat: number, user: User } = jwt_decode(response.data.access_token);
                this.user = tokenPayload.user;
                this.userService.user = this.user;
                localStorage.setItem('accessToken', response.data.access_token);
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
                this.dialogRef.close();
            },
            error: (err) => {
                this.profile.enable();
                this.loading = false;
                const errors: { field: string, message: string }[] | undefined = err.error.errors;
                let message: string = err.error.error ?? GlobalConstants.genericError;
                if (errors && errors.length > 0) {
                    message = errors.map((obj) => obj.message).join(', ')
                }
                this.snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
}
