// ================================================================>> Core Library
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgClass, NgIf }            from '@angular/common';
import { Router, RouterLink }       from '@angular/router';

// ================================================================>> Third Party Library
import { MatButtonModule }          from '@angular/material/button';
import { MatDividerModule }         from '@angular/material/divider';
import { MatIconModule }            from '@angular/material/icon';
import { MatMenuModule }            from '@angular/material/menu';
import { TranslocoModule }          from '@ngneat/transloco';

import { Subject, takeUntil }       from 'rxjs';

// ================================================================>> Costom Library
import { AuthService }              from 'app/core/auth/auth.service';
import { UserService }              from 'app/core/user/user.service';
import { User }                     from 'app/core/user/user.types';
import { environment as env }       from 'environments/environment';




@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user',
    standalone     : true,
    imports        : [MatButtonModule, TranslocoModule, RouterLink, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule],
})

export class UserComponent implements OnInit, OnDestroy
{
    fileUrl = env.FILE_BASE_URL;

    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef  : ChangeDetectorRef,
        private _router             : Router,
        private _userService        : UserService,
        private _authService        : AuthService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    logout(): void {
        
        this._authService.logout();
        this._router.navigateByUrl('/auth/login');
    }
}
