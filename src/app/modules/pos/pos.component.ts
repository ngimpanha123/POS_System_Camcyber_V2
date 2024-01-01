import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PosService } from './pos.service';
import { Data, Product } from './pos.types';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from 'helpers/services/snack-bar/snack-bar.service';
import { GlobalConstants } from 'helpers/shared/global-constants';
import { MatTabsModule } from '@angular/material/tabs';
import { ItemComponent } from './item/item.component';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DecimalPipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedDetailsComponent } from 'helpers/shared/details/details.component';

interface CartItem {
    id: number;
    name: string;
    qty: number;
    temp_qty: number;
    unit_price: number;
}

@Component({
    selector: 'app-pos',
    standalone: true,
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss'], // Note: Corrected from 'styleUrl' to 'styleUrls'
    imports: [
        DecimalPipe,
        MatIconModule,
        MatTabsModule,
        ItemComponent,
        FormsModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ]
})
export class PosComponent implements OnInit, OnDestroy {

    private posService: PosService;
    private snackBarService: SnackbarService;
    private _unsubscribeAll: Subject<User> = new Subject<User>();
    data: Data[] = [];
    isLoading: boolean = false;
    carts: CartItem[] = [];
    user: User;
    isOrderBeingMade: boolean = false;
    canSubmit: boolean = false;
    totalPrice: number = 0;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService
    ) {
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.user = user;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this.posService = inject(PosService);
        this.snackBarService = inject(SnackbarService);
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.posService.list().subscribe({
            next: response => {
                this.data = response.data;
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                this.snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    addToCart(incomingItem: Product, qty = 0): void {
        const existingItem = this.carts.find(item => item.id === incomingItem.id);

        if (existingItem) {
            existingItem.qty += qty;
            existingItem.temp_qty = existingItem.qty;
        } else {
            const newItem: CartItem = {
                id: incomingItem.id,
                name: incomingItem.name,
                qty: qty,
                temp_qty: qty,
                unit_price: incomingItem.unit_price,
            };
            this.carts.push(newItem);
            this.canSubmit = true;
        }

        this.getTotalPrice();
    }

    getTotalPrice(): void {
        this.totalPrice = this.carts.reduce((total, item) => total + (item.qty * item.unit_price), 0);
    }

    remove(value: any, index: number = -1): void {
        if (value === 0) {
            this.canSubmit = true;
        }

        this.carts.splice(index, 1);
        this.getTotalPrice();
    }

    blur(event: any, index: number = -1): void {
        const tempQty = this.carts[index].qty;

        if (event.target.value == 0) {
            this.canSubmit = false;
        } else {
            this.canSubmit = true;
        }

        const enteredValue = parseInt(event.target.value, 10);
        if (enteredValue > 1000) {
            event.target.value = '1000';
        }

        if (!event.target.value) {
            this.carts[index].qty = tempQty;
            this.carts[index].temp_qty = tempQty;
        } else {
            this.carts[index].qty = enteredValue;
            this.carts[index].temp_qty = enteredValue;
        }

        this.getTotalPrice();
    }

    private matDialog = inject(MatDialog);
    checkOut(): void {
        const carts: { [itemId: number]: number } = {};
        this.carts.forEach((item: CartItem) => {
            carts[item.id] = item.qty;
        });

        const body = {
            cart: JSON.stringify(carts)
        };

        this.isOrderBeingMade = true;
        this.posService.create(body).subscribe({
            next: response => {
                this.isOrderBeingMade = false;
                this.carts = [];
                this.snackBarService.openSnackBar(response.message, GlobalConstants.success);
                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = response.data;
                dialogConfig.width = "650px";
                dialogConfig.minHeight = "200px";
                dialogConfig.autoFocus = false;
                this.matDialog.open(SharedDetailsComponent, dialogConfig);
            },
            error: (err: HttpErrorResponse) => {
                this.isOrderBeingMade = false;
                this.snackBarService.openSnackBar(err?.error?.message || GlobalConstants.genericError, GlobalConstants.error);
            }
        });
    }
}
