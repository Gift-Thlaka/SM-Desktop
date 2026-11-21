
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ErrorBar } from '../errorBar/errorBar';
import { LoadingBar } from '../loading/loading';

interface logIns {
    email: string,
    password: string
}

interface signIns {
    name: string,
    email: string,
    password: string
}

interface LoginResponse {
    message: string,
    S_id: number
}

@Component ({
    selector: 'app-login',
    standalone: true,
    imports: [ErrorBar, FormsModule, LoadingBar],
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})

export class LoginScreen {

    constructor(private http: HttpClient, private router: Router) {}

    errorText = signal('');
    loading = signal(false);

    LoginData: logIns = {
        email: '',
        password: ''
    }

    login(): void {

        if (this.LoginData.email.trim() === '') {
            this.errorText.set('Enter email');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.LoginData.email)) {
            this.errorText.set("Ensure a valid email address");
            return;
        }

        if (this.LoginData.password.trim() === '') {
            this.errorText.set('Enter password');
            return;
        }

        this.loading.set(true);

        this.http.post<LoginResponse>(
            'https://sm-api-n27i.onrender.com/login', this.LoginData
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');

                localStorage.setItem('S_id', success.S_id.toString());

                this.LoginData.email = '';
                this.LoginData.password = '';
                this.loading.set(false);

                this.router.navigate(['dashboard']);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to login, try again');
                this.LoginData.password = '';
                this.loading.set(false);
            }
        });
    }

    createStore = signal(false);

    openCreate(): void {
        this.createStore.set(true);
        this.errorText.set('');
    }

    closeCreate(): void {
        this.createStore.set(false);
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

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signinData.email)) {
            this.errorText.set("Ensure a valid email address");
            return;
        }

        if (this.signinData.password.trim() === '') {
            this.errorText.set('Enter secret password');
            return;
        }

        if (this.signinData.password.length < 8) {
            this.errorText.set("Password must contain at least 8 characters");
            return;
        }

        this.loading.set(true);

        this.http.post<LoginResponse>(
            'https://sm-api-n27i.onrender.com/signin', this.signinData
        ).subscribe ({
            next: (success) => {
                this.errorText.set('');

                localStorage.setItem('S_id', success.S_id.toString());

                this.signinData.name = '';
                this.signinData.email = '';
                this.signinData.password = '';
                this.loading.set(false);

                this.router.navigate(['dashboard']);
            },
            error: (error) => {
                this.errorText.set(error.error?.detail || 'Failed to create store, try again');
                this.signinData.email = '';
                this.signinData.password = '';
                this.loading.set(false);
            }
        });
    }

}
