// ================================================================================>> Core Library
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ================================================================================>> Thrid Party Library
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// ================================================================================>> Custom Library
// Core
import { User } from 'app/core/user/user.types';

// Environment
import { environment as env } from 'environments/environment';

// Helper
import { LoadingSpinnerService } from 'helpers/shared/loading/loading.service';
import { PortraitComponent } from 'helpers/shared/portrait/portrait.component';

// Local
// import { Setup } from '../interface';
// import { UpdateSignatureComponent } from './signature/component';
// import { TwoFAComponent } from './twoFA/component';
import { UpdateProfileComponent } from '../update/component';

@Component({
    selector: 'profile-overview',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatOptionModule, MatDividerModule, MatFormFieldModule, UpdateProfileComponent],
    templateUrl: './overview.component.html',
    styleUrls: ['./style.scss']
})
export class OverviewComponent {
    @Input() user: User;
    @Input() src: string = 'assets/images/avatars/profile.jpg';
    signature: string
    loading: boolean;
    // setup: Setup;
    currentDate: Date = new Date();
    private loadingSpinner = inject(LoadingSpinnerService);
    constructor(
        private readonly matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.signature = env.FILE_BASE_URL + this.user.avatar;
        // this.setupData();                  
    }

    updateDialog():void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            user: this.user,
            src: this.src,
        }
        dialogConfig.autoFocus = false;
        dialogConfig.position = { right: '0', top: '0' };
        dialogConfig.height = '100vh';
        dialogConfig.panelClass = 'side-dialog';
        this.matDialog.open(UpdateProfileComponent, dialogConfig);
    }

    // changeSignature():void {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.autoFocus = false;
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.width = '450px';
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     this.matDialog.open(UpdateSignatureComponent, dialogConfig);
    // }

    // TwoFA():void {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.data = {
    //         phone: this.user.phone,
    //     }
    //     dialogConfig.autoFocus = false;
    //     dialogConfig.position = { right: '0', top: '0' };
    //     dialogConfig.width = '450px';
    //     dialogConfig.height = '100vh';
    //     dialogConfig.panelClass = 'side-dialog';
    //     this.matDialog.open(TwoFAComponent, dialogConfig);
    // }

    // setupData(): void {
    //     this.loadingSpinner.open();
    //     this.accountService.setup().subscribe({
    //         next: (response: ResponseSetup) => {
    //             this.setup = response.data;
    //             this.loadingSpinner.close();
    //         },
    //         error: (err: HttpErrorResponse) => {
    //             const error: { httpStatus: 400, message: string } = err.error;
    //             this.snackBarService.openSnackBar(error.message ?? GlobalConstants.genericError, GlobalConstants.error);
    //             this.loadingSpinner.close();
    //         }
    //     })
    // }
}
