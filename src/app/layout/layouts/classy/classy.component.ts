// ================================================================>> Core Library
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NgIf }                                 from '@angular/common';


// ================================================================>> Third Party Library
import { MatButtonModule }                      from '@angular/material/button';
import { MatIconModule }                        from '@angular/material/icon';
import { Subject, takeUntil }                   from 'rxjs';

// ================================================================>> Custom Library
import { HelpersNavigationService, HelpersNavigationComponent } from 'helpers/components/navigation';
import { HelpersFullscreenComponent }           from 'helpers/components/fullscreen';
import { HelpersLoadingBarComponent }           from 'helpers/components/loading-bar';
import { HelpersMediaWatcherService }           from 'helpers/services/media-watcher';
import { NavigationService }                    from 'app/core/navigation/navigation.service';
import { Navigation }                           from 'app/core/navigation/navigation.types';
import { UserService }                          from 'app/core/user/user.service';
import { User }                                 from 'app/core/user/user.types';
import { LanguagesComponent }                   from 'app/layout/common/languages/languages.component';
import { UserComponent }                        from 'app/layout/common/user/user.component';
import { HelpersConfigService, Scheme }         from 'helpers/services/config';
import { environment as env }                   from 'environments/environment';
import { LoadingComponent }                     from 'helpers/shared/loading/loading.component';


@Component({
    
    selector        : 'classy-layout',
    templateUrl     : './classy.component.html',
    encapsulation   : ViewEncapsulation.None,
    standalone      : true,
    imports         : [HelpersLoadingBarComponent, LoadingComponent, HelpersNavigationComponent, UserComponent, NgIf, MatIconModule, MatButtonModule, LanguagesComponent, HelpersFullscreenComponent, RouterOutlet],
})

export class ClassyLayoutComponent implements OnInit, OnDestroy {

    isScreenSmall   : boolean;
    navigation      : Navigation;
    user            : User;
    role            : string;
    fileUrl         : string = env.FILE_BASE_URL;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _navigationService          : NavigationService,
        private _userService                : UserService,
        private _changeDetectorRef          : ChangeDetectorRef,
        private _helpersMediaWatcherService : HelpersMediaWatcherService,
        private _helpersNavigationService   : HelpersNavigationService,
        private _helpersConfigService       : HelpersConfigService
    ) { }

    ngOnInit(): void {

        // Subscribe to navigation data
        this._navigationService.navigation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((navigation: Navigation) => {
            this.navigation = navigation;
        });

        // Subscribe to the user service
        this._userService.user$.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: User) => {
            this.user = user;
        });

        // Subscribe to user changes
        this._userService.role$.pipe(takeUntil(this._unsubscribeAll)).subscribe((roleCheck: string) => {
            this.role = roleCheck;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to media changes
        this._helpersMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
            // Check if the screen is small
            this.isScreenSmall = !matchingAliases.includes('md');
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._helpersNavigationService.getComponent<HelpersNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    isDark: boolean = false;
    setScheme(scheme: Scheme): void {
        this.isDark = false;

        if (scheme === 'light') {
            this.isDark = true;
        }
        this._helpersConfigService.config = { scheme };
    }
}
