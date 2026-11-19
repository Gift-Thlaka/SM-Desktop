import { Component, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';

interface product {
    name: string,
    size: string,
    price: string,
    barcode: string,
    best_before: string,
    
}

interface shelfProduct extends product {
    P_id: number,
    quantity: number,
    batch: string
}

@Component ({
    selector: 'dashboard',
    standalone: true,
    imports: [ErrorBar, FormsModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})

export class DashboardScreen implements OnInit {

    constructor (private http: HttpClient) {}

    errorText = signal('');

    ngOnInit() {
        this.getShelf();
    }

    items = signal(<shelfProduct[]> ([]));

    getShelf(): void {
        this.http.get<shelfProduct[]> (
            'http://localhost:8000/get-shelf'
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.items.set(success);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to get shelves');
            }
        });
    }

    products: product = {
        name: '',
        size: '',
        price: '',
        barcode: '',
        best_before: ''
    }

    addProduct(): void {

        if (this.products.name.trim() === '') {
            this.errorText.set('Enter product name.');
            return;
        }

        if (this.products.size.trim() === '') {
            this.errorText.set('Enter product size.');
            return;
        }

        if (this.products.price.trim() === '') {
            this.errorText.set('Enter price.');
            return;
        }

        if (this.products.barcode.trim() === '') {
            this.errorText.set('Enter barcode.');
            return;
        }

        if (this.products.best_before.trim() === '') {
            this.errorText.set('enter expiry date of batch.');
            return;        
        }

        this.http.post (
            'http://localhost:8000/add-product', this.products
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to add new product');
            }

        })
    }

    selectedItem = signal<number | null>(null);
    update = signal(false);

    openUpdate(ItemId: number): void {
        this.selectedItem.set(ItemId);
        this.update.set(true);
    }

    closeUpdate(): void {
        this.update.set(false);
        this.selectedItem.set(null);
    }

    updateItem(ItemId: number): void {

        if (this.products.price.trim() === '') {
            this.errorText.set('Failed, Please enter new price');
            this.closeUpdate();
            return;
        }

        this.http.post(
            'http://localhost:8000/update-item', {item_id: ItemId, peicw: this.products.price}
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.products.price=('');
                this.closeUpdate();
                this.getShelf();
            },
            error: (error) => {
                this.closeUpdate();
                this.errorText.set(error.error?.detail || 'Failed to update item');
            }
        });
    }

    
}