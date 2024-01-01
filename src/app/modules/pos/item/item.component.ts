import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../pos.types';
import { environment as env } from 'environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'product-item',
    standalone: true,
    templateUrl: './item.component.html',
    styleUrl: './item.component.scss',
    imports: [
        MatIconModule,
        DecimalPipe
    ],
})
export class ItemComponent {
    @Input() data: Product;
    @Output() result = new EventEmitter<Product>;
    public fileUrl: string = env.FILE_BASE_URL;

    onOutput() {
        this.result.emit(this.data);
    }

}
