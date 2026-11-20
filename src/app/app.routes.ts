import { Routes } from '@angular/router';

import { DashboardScreen } from './dashboard/dashboard';
import { LoginScreen } from './login/login';
import { Notifications } from './notifications/notifications';
import { InventoryPage } from './inventory/inventory';
import { POS } from './pos/pos';
import { authGuard } from './auth.guard';


export const routes: Routes = [

    {
        path: 'dashboard',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        component: DashboardScreen,
        canActivate: [authGuard]
    },

    {
        path: 'login',
        component: LoginScreen
    },

    {
        path: 'notifications',
        component: Notifications,
        canActivate: [authGuard]
    },

    {
        path: 'staff',
        component: InventoryPage,
        canActivate: [authGuard]
    },

    {
        path: 'demoPos',
        component: POS,
        canActivate: [authGuard]
    }

];
