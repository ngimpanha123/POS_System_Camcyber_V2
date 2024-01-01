import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ProfileService } from '../profile.service';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { environment as env } from 'environments/environment';
import jwt_decode from 'jwt-decode';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PortraitComponent } from 'helpers/shared/portrait/portrait.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface UserPayload {
    exp: number;
    iat: number;
    user: User;
    role: string;
}

@Component({
    selector: 'profile-overview',
    standalone: true,
    templateUrl: './overview.component.html',
    imports: [
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
    private _unsubscribeAll: Subject<User> = new Subject<User>();
    public form: UntypedFormGroup;
    public src: string = 'assets/images/avatars/profile.jpg';
    public user: User;

    constructor(
        private _userService: UserService,
        private _serviceProfile: ProfileService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: SnackbarService
    ) { }

    ngOnInit(): void {
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.user = user;
            this.src = env.FILE_BASE_URL + this.user.avatar;
        });
        this._buildForm();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    submit(): void {
        this.form.disable();
        this.form.disable();
        this._serviceProfile.updateProfile(this.form.value).subscribe({
            next: (response) => {
                this.form.enable();
                const tokenPayload: UserPayload = jwt_decode(response.access_token);
                this._userService.user = tokenPayload.user;
                localStorage.setItem('accessToken', response.access_token);
                this._snackBar.openSnackBar(response.message, GlobalConstants.success);
            },
            error: (err: HttpErrorResponse) => {
                this.form.enable();
                this._snackBar.openSnackBar(err?.error?.message ?? GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    srcChange(src: string): void {
        this.form.get('avatar').setValue(src);
    }

    private _buildForm(): void {
        this.form = this._formBuilder.group({
            name: [this.user.name, [Validators.required]],
            phone: [this.user.phone, [Validators.required, Validators.pattern(/^(\+855|0)[1-9]\d{7,8}$/)]],
            email: [this.user.email, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            avatar: [''],
        });
    }
}
