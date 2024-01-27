// ================================================================>> Core Library (Angular)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// ================================================================>> Third Party Library (Angular Material)
import { MatTabsModule } from '@angular/material/tabs';

// ================================================================>> Custom Library (Application-specific)
import { OverviewComponent } from './overview/overview.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [
        CommonModule,
        MatTabsModule,
        OverviewComponent,
        ChangePasswordComponent
    ],
})
export class ProfileComponent {

}
