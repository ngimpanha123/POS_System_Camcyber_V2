import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
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
