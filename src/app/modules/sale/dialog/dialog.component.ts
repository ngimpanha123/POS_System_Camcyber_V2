import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Data } from '../sale.types';

@Component({
    selector: 'sale-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class SaleDialogComponent implements OnInit {

    ResponseData = new EventEmitter<Data>()

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Data,
        private dialogRef: MatDialogRef<SaleDialogComponent>
    ) { }

    ngOnInit(): void {
        console.log(this.data)
    }
}
