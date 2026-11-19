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
    S_id: number
    
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

        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Manager not found.');
            return;
        }

        this.http.get<shelfProduct[]> (
            `http://localhost:8000/get-shelf?S_id=${S_id}`
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
        best_before: '',
        S_id: 0
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

        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Manager not found. Please login again.');
            return;
        }

        this.products.S_id = Number(S_id);

        this.http.post (
            'http://localhost:8000/add-product', this.products
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.getShelf();
                this.products.name = '';
                this.products.size = '';
                this.products.price = '';
                this.products.barcode = '';
                this.products.best_before = '';
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
            'http://localhost:8000/update-item', {item_id: ItemId, price: this.products.price}
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.products.price='';
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