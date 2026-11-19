import { Routes } from '@angular/router';

import { DashboardScreen } from './dashboard/dashboard';
import { LoginScreen } from './login/login';
import { Notifications } from './notifications/notifications';
import { InventoryPage } from './inventory/inventory';


export const routes: Routes = [

    {
        path: 'dashboard',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        component: DashboardScreen
    },

    {
        path: 'login',
        component: LoginScreen
    },

    {
        path: 'notifications',
        component: Notifications
    },

    {
        path: 'staff',
        component: InventoryPage
    }

];
