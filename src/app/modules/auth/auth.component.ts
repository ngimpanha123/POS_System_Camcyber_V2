// ================================================================>> Core Library (Angular)
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgIf }                         from '@angular/common';
import { Component, OnInit, inject }    from '@angular/core';
import { HttpErrorResponse }            from '@angular/common/http';
import { Router }                       from '@angular/router';

// ================================================================>> Third-Party Libraries
import { MatButtonModule }              from '@angular/material/button';
import { MatCheckboxModule }            from '@angular/material/checkbox';
import { MatFormFieldModule }           from '@angular/material/form-field';
import { MatIconModule }                from '@angular/material/icon';
import { MatInputModule }               from '@angular/material/input';
import { MatProgressSpinnerModule }     from '@angular/material/progress-spinner';

// ================================================================>> Custom Libraries (Application-specific)
import { AuthService }                  from 'app/core/auth/auth.service';
import { SnackbarService }              from 'helpers/services/snack-bar/snack-bar.service';
import { GlobalConstants }              from 'helpers/shared/global-constants';


@Component({

    selector        : 'auth',
    templateUrl     : './auth.component.html',
    styleUrls       : ['./auth.component.scss'],
    standalone      : true,
    imports         : [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})

export class AuthLoginComponent implements OnInit {

    // Properties for login functionality
    saving: boolean = false;                    // Flag to indicate whether the login request is being processed
    loginForm: UntypedFormGroup;                // Form group to manage the login form fields

    // Constructor where AuthService, UntypedFormBuilder, and Router are injected
    constructor(

        private authService     : AuthService,
        private formBuilder     : UntypedFormBuilder,
        private router          : Router
    ) { }

    // Lifecycle hook: ngOnInit is called when the component is initialized
    ngOnInit(): void {

        // Initialize the login form with default values
        this.loginForm  = this.formBuilder.group({

            username        : ['0977779688', [Validators.required]],            // Default username value with validation
            password        : ['123456', Validators.required]                   // Default password value with validation
        });
    }

    // Inject SnackbarService for displaying snack bar messages
    private snackBarService = inject(SnackbarService);

    // Method to handle the login functionality
    login     (): void {

        // Sign in by calling the login method of the AuthService
        this.authService.login(this.loginForm.value).subscribe({

            // Successful login response
            next    : _response => {

                // Redirect to the home page after successful login
                this.router.navigateByUrl('');
        },

        error   : (err: HttpErrorResponse) => {

            // Extract error details, if available
            const   errors  : { field: string, message: string }[] | undefined = err.error.errors;

            // Default error message (if not provided in the response)
            let     message : string = err.error.message ?? GlobalConstants.genericError;

            // If there are specific errors, concatenate them to the message
            if  (errors && errors.length > 0) {

                 message    = errors.map((obj) => obj.message).join(', ');
            }
            
            // Display the error message using the SnackbarService
            this.snackBarService.openSnackBar(message, GlobalConstants.error);
        }
        });
    }
}
