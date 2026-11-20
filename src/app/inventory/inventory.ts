
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ErrorBar } from '../errorBar/errorBar';

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
    imports: [ErrorBar, FormsModule],
    templateUrl: './inventory.html',
    styleUrls: ['./inventory.css']
})

export class InventoryPage implements OnInit {

    constructor(private http: HttpClient) {};

    ngOnInit(): void {
        this.getStaff();
    }

    errorText = signal('');

    StaffList = signal<StaffList[]>([]);

    getStaff(): void {

        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Shop not found.');
            return;
        }

        this.http.get<StaffList[]>(
            `https://sm-api-n27i.onrender.com/inventory-staff?S_id=${S_id}`
        ).subscribe({
            next: (success) => {
                this.errorText.set('');
                this.StaffList.set(success);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to get Staff');
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
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to register employee.');
            }
        });
    }

    removeStaff(E_Id: number): void {

        const S_id = localStorage.getItem('S_id');

        if (!S_id) {
            this.errorText.set('Shop not found.');
            return;
        }

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
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to delete employee.');
            }
        });
    }

}
