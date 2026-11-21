
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

    const router = inject(Router);

    const S_id = localStorage.getItem('S_id');

    if (S_id) {
        return true;
    }

    router.navigate(['/login']);
    return false;

};
