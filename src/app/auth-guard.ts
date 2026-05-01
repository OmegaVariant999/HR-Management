import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Checks if the user is logged in via local storage
  const isLoggedIn = !!localStorage.getItem('isLoggedIn');

  if (isLoggedIn) {
    return true;
  } else {
    // Redirects to landing page if access is denied
    return router.parseUrl('/');
  }
};
