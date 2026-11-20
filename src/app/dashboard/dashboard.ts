import { Component, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';
import { LoadingBar } from '../loading/loading';

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
    imports: [ErrorBar, FormsModule, LoadingBar],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})

export class DashboardScreen implements OnInit {

    constructor (private http: HttpClient) {}

    errorText = signal('');
    loading = signal(false);

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

        this.loading.set(true);

        this.http.get<shelfProduct[]> (
            `https://sm-api-n27i.onrender.com/get-shelf?S_id=${S_id}`
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.items.set(success);
                this.loading.set(false);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to get shelves');
                this.loading.set(false);
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
        
        this.loading.set(true);

        this.http.post (
            'https://sm-api-n27i.onrender.com/add-product', this.products
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.getShelf();
                this.products.name = '';
                this.products.size = '';
                this.products.price = '';
                this.products.barcode = '';
                this.products.best_before = '';
                this.loading.set(false);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to add new product');
                this.loading.set(false);
            }

        })
    }

    selectedItem = signal<number | null>(null);
    update = signal(false);

    openUpdate(ItemId: number): void {
        this.products.price = '';
        this.selectedItem.set(ItemId);
        this.update.set(true);
    }

    closeUpdate(): void {
        this.update.set(false);
        this.selectedItem.set(null);
    }

    updateItem(ItemId: number): void {

        if (this.products.price.trim() === '') {
            this.errorText.set('Please enter new price.');
            return;
        }

        this.loading.set(true);

        this.http.post(
            'https://sm-api-n27i.onrender.com/update-item',
            {
                item_id: ItemId,
                price: this.products.price
            }
        ).subscribe({
            next: (success: any) => {
                this.errorText.set(success.message);

                this.products.price = '';
                this.closeUpdate();
                this.getShelf();
                this.loading.set(false);
            },
            error: (error) => {
                console.log('UPDATE ITEM ERROR:', error);

                this.errorText.set(
                    error.error?.detail || 'Failed to update item.'
                );
                this.loading.set(false);
            }
        });
    }

    
}