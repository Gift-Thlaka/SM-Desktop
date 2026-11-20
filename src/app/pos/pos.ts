
import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';
import  {LoadingBar } from '../loading/loading';

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
    selector: 'app-pos',
    standalone: true,
    imports: [ErrorBar, LoadingBar],
    templateUrl: './pos.html',
    styleUrls: ['./pos.css']
})

export class POS implements OnInit {

    constructor(private http: HttpClient) {}

    errorText = signal('');
    loading = signal(false);

    ngOnInit() {
        this.getShelf();
    }

    items = signal<shelfProduct[]>([]);

    getShelf(): void {
        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Manager not found.');
            return;
        }

        this.loading.set(true);

        this.http.get<shelfProduct[]>(
            `https://sm-api-n27i.onrender.com/get-shelf?S_id=${S_id}`
        ).subscribe({
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

    buyProduct(P_id: number): void {
        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Shop not found.');
            return;
        }

        this.loading.set(true);

        this.http.post<any>(
            'https://sm-api-n27i.onrender.com/buy-product',
            {
                P_id: P_id,
                S_id: Number(S_id)
            }
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                console.log('Purchase successful:', success);
                this.getShelf();
                this.loading.set(false);
            },
            error: (error) => {
                this.errorText.set(
                    error.error?.detail || 'Purchase failed.'
                );
                this.loading.set(true);
            }
        });
    }
}
