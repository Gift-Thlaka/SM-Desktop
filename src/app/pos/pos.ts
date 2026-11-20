
import { Component, OnInit, signal } from '@angular/core';
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
    selector: 'app-pos',
    standalone: true,
    imports: [ErrorBar],
    templateUrl: './pos.html',
    styleUrls: ['./pos.css']
})

export class POS implements OnInit {

    constructor(private http: HttpClient) {}

    errorText = signal('');

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

        this.http.get<shelfProduct[]>(
            `http://localhost:8000/get-shelf?S_id=${S_id}`
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                this.items.set(success);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to get shelves');
            }
        });
    }

    buyProduct(P_id: number): void {
        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Shop not found.');
            return;
        }

        this.http.post<any>(
            'http://localhost:8000/buy-product',
            {
                P_id: P_id,
                S_id: Number(S_id)
            }
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                console.log('Purchase successful:', success);

                // Refresh the displayed products and quantities
                this.getShelf();
            },
            error: (error) => {
                this.errorText.set(
                    error.error?.detail || 'Purchase failed.'
                );
            }
        });
    }
}
