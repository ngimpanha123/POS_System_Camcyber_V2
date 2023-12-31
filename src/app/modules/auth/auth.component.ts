import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helpers/shared/global-constants';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthLoginComponent implements OnInit {

    saving: boolean = false;
    loginForm: UntypedFormGroup;

    constructor(
        private authService: AuthService,
        private formBuilder: UntypedFormBuilder,
        private router: Router,
    ) { }


    ngOnInit(): void {

        this.loginForm = this.formBuilder.group({
            username: ['0977779688', [Validators.required]],
            password: ['123456', Validators.required]
        });
    }

    private snackBarService = inject(SnackbarService);
    login(): void {

        // Sign in
        this.authService.login(this.loginForm.value).subscribe({
            next: _response => {
                this.router.navigateByUrl('');
            },
            error: (err: HttpErrorResponse) => {
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
