import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';

interface items {
    id: number,
    name: string,
    barcode: string,
    price: number,
    total: number
}

@Component ({
    selector: 'inventory',
    standalone: true,
    imports: [ErrorBar, FormsModule],
    templateUrl: './inventory.html',
    styleUrls: ['./inventory.css']
})

export class InventoryScreen implements OnInit {

    constructor(private http: HttpClient) {};

    ngOnInit(): void {
        this.getInventory();
    }

    errorText = signal('');

    inventoryList = signal(<items[]> ([]));

    getInventory(): void {
        this.http.get<items[]> (
            'http://localhost:8000/inventory-items'
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.inventoryList.set(success);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'failed to geet inventory');
            }
        });
    }

    updateItem(ItemId: number): void {

    }

}