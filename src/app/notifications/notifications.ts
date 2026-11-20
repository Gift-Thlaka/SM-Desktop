import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';
import { LoadingBar } from '../loading/loading';

interface item {
    id :number,
    name: string,
    instruction: string
}

@Component ({
    selector: 'app-notifications',
    standalone: true,
    imports: [ErrorBar, LoadingBar],
    templateUrl: './notifications.html',
    styleUrls: ['./notifications.css']
})

export class Notifications implements OnInit{

    constructor (private http: HttpClient) {}

    errorText = signal('');
    loading = signal(false);
    
    ngOnInit(): void {
        this.getNotifications();
    }

    notificationList = signal<item[]>([]);

    getNotifications(): void {

        const S_id = localStorage.getItem("S_id");

        this.loading.set(true);

        this.http.get<item[]>(
            `https://sm-api-n27i.onrender.com/notifications?S_id=${S_id}`
        ).subscribe({
            next: (success) => {

                console.log("API RESPONSE:", success);
                console.log("IS ARRAY:", Array.isArray(success));
                console.log("LENGTH:", success?.length);

                this.notificationList.set(success);
                this.errorText.set('');
                this.loading.set(false);
            },
            error: (error) => {
                console.log("API ERROR:", error);

                this.errorText.set(
                    error.error?.detail || 'failed to load notifications'
                );
                this.loading.set(false);
            }
        });
    }

    
    updated(itemId: number): void {

        const S_id = localStorage.getItem("S_id");

        this.loading.set(true);

        this.http.post(
            'https://sm-api-n27i.onrender.com/notifications/release',
            {
                S_id: Number(S_id),
                N_id: itemId
            }
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                this.getNotifications();
                this.loading.set(false);
            },
            error: (error) => {
                this.errorText.set(
                    error.error?.detail || 'Failed to update inventory, try again.'
                );
                this.loading.set(false);
            }
        });
    }

    

}

