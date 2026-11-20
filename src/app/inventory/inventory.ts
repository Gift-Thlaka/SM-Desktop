
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';
import { LoadingBar } from '../loading/loading';

interface staff {
    name: string,
    role: string,
    password: string
}

interface StaffList extends staff {
    E_id: number,
    emp_id: string
}

@Component ({
    selector: 'inventory',
    standalone: true,
    imports: [ErrorBar, FormsModule, LoadingBar],
    templateUrl: './inventory.html',
    styleUrls: ['./inventory.css']
})

export class InventoryPage implements OnInit {

    constructor(private http: HttpClient) {};

    ngOnInit(): void {
        this.getStaff();
    }

    errorText = signal('');
    loading = signal(false);

    StaffList = signal<StaffList[]>([]);

    getStaff(): void {

        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Shop not found.');
            return;
        }

        this.loading.set(true);

        this.http.get<StaffList[]>(
            `https://sm-api-n27i.onrender.com/inventory-staff?S_id=${S_id}`
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                this.StaffList.set(success);
                this.loading.set(false);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to get Staff');
                this.loading.set(false);
            }
        });
    }

    Staff: staff = {
        name: '',
        role: '',
        password: ''
    }

    addEmployee(): void {

        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Shop not found.');
            return;
        }

        if (this.Staff.name.trim() === '') {
            this.errorText.set("Enter name.");
            return;
        }
        if (this.Staff.role.trim() === '') {
            this.errorText.set("Enter department");
            return;
        }
        if (this.Staff.password.trim() === '') {
            this.errorText.set("Enter password");
            return;
        }

        this.loading.set(true);

        this.http.post(
            'https://sm-api-n27i.onrender.com/add-employee',
            {
                ...this.Staff,
                S_id: Number(S_id)
            }
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                this.Staff.name = '';
                this.Staff.role = '';
                this.Staff.password = '';
                this.getStaff();
                this.loading.set(false);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to register employee.');
                this.loading.set(false);
            }
        });
    }

    removeStaff(E_Id: number): void {

        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Shop not found.');
            return;
        }

        this.loading.set(true);

        this.http.post(
            'https://sm-api-n27i.onrender.com/delete-staff',
            {
                E_id: E_Id,
                S_id: Number(S_id)
            }
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                this.getStaff();
                this.loading.set(false);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to delete employee.');
                this.loading.set(false);
            }
        });
    }

}
