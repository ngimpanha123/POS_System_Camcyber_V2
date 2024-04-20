// ================================================================================>> Core Library
import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

// ================================================================================>> Thrid Party Library
// Material
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

// RxJS
import { Subject, takeUntil } from 'rxjs';

// ================================================================================>> Custom Library
// Core
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

// Environment
import { environment as env } from 'environments/environment';

// Helper
import { HelpersMediaWatcherService } from 'helpers/services/media-watcher';

// Local
import { ChangePasswordComponent } from './password/change-password.component';
import { OverviewComponent } from './profile/overview/overview.component';

@Component({
    selector: 'app-account',
    standalone: true,
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    imports: [MatSidenavModule, MatIconModule, NgSwitch, NgSwitchCase, NgFor, NgClass, ChangePasswordComponent, OverviewComponent]
})
export class AccountComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'profile';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;
    src: string = 'assets/images/avatars/image-icon.jpg';
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _mediaWatcherService: HelpersMediaWatcherService,
        private _userService: UserService
    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        // Setup available panels
        this.panels = [
            {
                id: 'profile',
                icon: 'heroicons_outline:user-circle',
                title: 'គណនី'
            },
            {
                id: 'security',
                icon: 'heroicons_outline:lock-closed',
                title: 'សុវត្ថិភាព'
            }
        ];

        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.user = user;
            this.src = env.FILE_BASE_URL + this.user.avatar;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to media changes
        this._mediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
            // Set the drawerMode and drawerOpened
            if (matchingAliases.includes('lg')) {
                this.drawerMode = 'side';
                this.drawerOpened = true;
            }
            else {
                this.drawerMode = 'over';
                this.drawerOpened = false;
            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
