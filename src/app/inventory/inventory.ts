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

    StaffList = signal(<StaffList[]> ([]));

    getStaff(): void {
        this.http.get<StaffList[]> (
            'http://localhost:8000/inventory-staff'
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.StaffList.set(success);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'failed to get Staff');
            }
        });
    }

    Staff: staff = {
        name: '',
        role: '',
        password: ''
    }
    addEmployee(): void {

        if (this.Staff.name.trim()  === '') {
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

        this.http.post (
            'http://localhost:8000/add-employee', this.Staff
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.Staff.name = '';
                this.Staff.role = '';
                this.Staff.password = '';
                this.getStaff();
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || "Failed to register employee.");
            }
        })

    }

    removeStaff(E_Id: number): void {
        this.http.post(
            'http://localhost:8000/delete-staff', {E_id: E_Id}
        ).subscribe ({
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