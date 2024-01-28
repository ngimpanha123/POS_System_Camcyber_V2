// ================================================================>> Core Library (Angular)
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

// ================================================================>> Third Party Library
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PortraitComponent } from 'helpers/shared/portrait/portrait.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import jwt_decode from 'jwt-decode'; // External library for decoding JWT tokens
import { Subject, takeUntil } from 'rxjs'; // RxJS library for observables


// ================================================================>> Custom Library (Application-specific)
import { GlobalConstants } from 'helpers/shared/global-constants';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ProfileService } from '../profile.service';
import { environment as env } from 'environments/environment'; // Custom import for environment variables

// Interface for decoding JWT token payload
interface UserPayload {
    exp     : number;
    iat     : number;
    user    : User;
    role    : string;
}

@Component({
    selector        : 'profile-overview',
    standalone      : true,
    templateUrl     : './overview.component.html',
    imports     : [
            CommonModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatProgressSpinnerModule,
            PortraitComponent
    ],
})

export class OverviewComponent implements OnInit, OnDestroy {

    private  _unsubscribeAll     : Subject<User> = new Subject<User>();
    public   form                : UntypedFormGroup;
    public   src                 : string = 'assets/images/avatars/profile.jpg';
    public   user                : User;

    constructor(
        private _userService        : UserService,
        private _serviceProfile     : ProfileService,
        private _formBuilder        : UntypedFormBuilder,
        private _snackBar           : SnackbarService
    ) { }

    // Subscribe to user changes using RxJS takeUntil to handle component destruction
    ngOnInit    (): void {
        
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.user   = user;
            this.src    = env.FILE_BASE_URL + this.user.avatar;
        });

        // Build the form when the component initializes
        this._buildForm();
    }

    ngOnDestroy (): void {

         // Unsubscribe from observables when the component is destroyed
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    submit(): void {

        // Disable the form during the submission
        this.form.disable();

        // Call the profile service to update the user profile
        this._serviceProfile.updateProfile(this.form.value).subscribe({

            next: (response) => {

                // Enable the form after a successful update
                this.form.enable();
                const tokenPayload: UserPayload = jwt_decode(response.access_token);
                this._userService.user = tokenPayload.user;

                // Save the updated access token to localStorage
                localStorage.setItem('accessToken', response.access_token);

                // Show a success message using the snackbar service
                this._snackBar.openSnackBar(response.message, GlobalConstants.success);
            },

            error: (err: HttpErrorResponse) => {

                // Enable the form after an error and show an error message
                this.form.enable();
                this._snackBar.openSnackBar(err?.error?.message ?? GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    srcChange(src: string): void {

        // Update the 'avatar' form control when the source changes
        this.form.get('avatar').setValue(src);
    }

    private _buildForm(): void {

        // Build the form using the user's current information
        this.form   = this._formBuilder.group({
            name    : [this.user.name, [Validators.required]],
            phone   : [this.user.phone, [Validators.required, Validators.pattern(/^(\+855|0)[1-9]\d{7,8}$/)]],
            email   : [this.user.email, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],

            avatar  : [''],         // This field is initially empty and will be updated when the image changes
        });
    }
}
