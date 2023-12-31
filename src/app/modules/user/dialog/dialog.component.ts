import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Data } from '../user.types';

@Component({
    selector: 'user-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class UserDialogComponent implements OnInit {

    ResponseData = new EventEmitter<Data>()

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { type: 'Creatr' | 'Update', user?: Data },
        private dialogRef: MatDialogRef<UserDialogComponent>
    ) { }

    ngOnInit(): void {
        console.log(this.data)
    }
}
