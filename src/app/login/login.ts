import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';

import { ErrorBar } from '../errorBar/errorBar';

interface logIns {
    email: string,
    password: string
}

interface signIns {
    name: string,
    email: string,
    password: string
}

@Component ({
    selector: 'app-login',
    standalone: true,
    imports: [ErrorBar, FormsModule],
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})

export class LoginScreen {

    constructor(private http: HttpClient, private router: Router) {}

    errorText = signal('');

    LoginData: logIns = {
        email: '',
        password: ''
    }

    login(): void {

        if (this.LoginData.email.trim() === '') {
            this.errorText.set('Enter email');
            return;
        }

        if (this.LoginData.password.trim() === '') {
            this.errorText.set('Enter password');
            return;
        }

        this.http.post (
            'http:localhost:8000/login', this.LoginData
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.LoginData.email = '';
                this.LoginData.password = '';
                this.router.navigate(['dashboard']);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to login, try again');
                this.LoginData.password = '';
            }
        });
    }

    createStore = signal(false);
    openCreate(): void {
        this.createStore.set(true);
        this.errorText.set('');
    }
    closeCreate(): void {
        this.createStore.set(false)
        this.errorText.set('');
    }

    signinData: signIns = {
        name: '',
        email: '',
        password: ''
    }

    signin(): void {


        if (this.signinData.name.trim() === '') {
            this.errorText.set('Enter store name');
            return;
        }
        
        if (this.signinData.email.trim() === '') {
            this.errorText.set('Enter email');
            return;
        }

        if (this.signinData.password.trim() === '') {
            this.errorText.set('Enter secret password');
            return;
        }

        this.http.post(
            'http://localhost:8000/sigin', this.signinData
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');
                this.signinData.name = '';
                this.signinData.email = '';
                this.signinData.password = '';
                this.router.navigate(['dashboard']);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to create store, try again');
                this.signinData.email = '';
                this.signinData.password = '';
            }
        });
    }

}