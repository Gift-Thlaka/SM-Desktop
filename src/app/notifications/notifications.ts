import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';

interface item {
    id :number,
    name: string,
    instruction: string
}

@Component ({
    selector: 'app-notifications',
    standalone: true,
    imports: [ErrorBar],
    templateUrl: './notifications.html',
    styleUrls: ['./notifications.css']
})

export class Notifications implements OnInit{

    constructor (private http: HttpClient) {}

    errorText = signal('');
    
    ngOnInit(): void {
        this.getNotifications();
    }

    notificationList = signal<item[]>([]);

    getNotifications(): void {

        this.http.get<item[]> (
            'http://localhost:8000/notifications'
        ).subscribe ({
            next: (success) => {
                this.notificationList.set(success);
                this.errorText.set('');
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'failed to load notifications');
            }
        });

    }

    updated(itemId: number): void {
        
        this.http.post(
            `http://localhost:8000/delete-notification?item_id=${itemId}`, {}
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.getNotifications()
            }, 
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to update inventory, try again.')
            }
        });
    }

}