import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { map, take, switchMap, from, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const firestore = inject(Firestore);

  return authState(auth).pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        localStorage.removeItem('isLoggedIn');
        return of(router.parseUrl('/login'));
      }

      // Fetch user data directly to ensure sync with guard execution
      return from(getDoc(doc(firestore, 'users', user.uid))).pipe(
        map(docSnap => {
          if (!docSnap.exists()) {
            return router.parseUrl('/login');
          }

          const userData = docSnap.data();
          const role = userData['role'];
          const status = userData['status'];
          const targetPath = route.routeConfig?.path || '';

          const isSuperAdmin = role === 'Super Admin';

          // 1. Check Approval Status (Super Admin is always pre-approved)
          if (!isSuperAdmin && status !== 'Approved') {
            console.warn(`[AuthGuard] Access Denied: User ${user.email} is not approved (status: ${status})`);
            return router.parseUrl('/login');
          }

          // 2. Check Permissions
          // Super Admin: All access
          if (isSuperAdmin) return true;

          // Permission Map
          const permissions: Record<string, string[]> = {
            'Admin': ['dash', 'emp', 'attn', 'prof', 'settings', 'apply-leave'],
            'Recruiter': ['dash', 'emp', 'add-emp', 'attn', 'prof', 'settings', 'apply-leave'],
            'Payroll Manager': ['dash', 'emp', 'attn', 'pay', 'prof', 'settings', 'apply-leave']
          };

          const allowedRoutes = permissions[role] || [];
          
          // Validate target path against allowed routes
          const isAllowed = allowedRoutes.some(p => targetPath === p || targetPath.startsWith(p + '/'));

          if (isAllowed) {
            return true;
          } else {
            console.warn(`[AuthGuard] Access Denied for role ${role} to path /${targetPath}`);
            return router.parseUrl('/not-found');
          }
        })
      );
    })
  );
};
