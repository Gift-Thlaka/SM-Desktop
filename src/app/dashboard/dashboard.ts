import { Component, OnInit, signal } from '@angular/core'

import { ErrorBar } from '../errorBar/errorBar';

@Component ({
    selector: 'dashboard',
    standalone: true,
    imports: [ErrorBar],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})

export class DashboardScreen {

    errorText = signal('');
    
}