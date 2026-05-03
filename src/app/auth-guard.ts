import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // Checks if the user is logged in via local storage
  // const isLoggedIn = !!localStorage.getItem('isLoggedIn');

  return authState(auth).pipe(
    take(1),
    map(user => {
      const manualLogin = localStorage.getItem('isLoggedIn') === 'true';
      if (user || manualLogin) {
        return true;
      }
      return router.parseUrl('/login');
    })
  );
};
