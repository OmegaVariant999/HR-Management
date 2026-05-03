import { Injectable, inject, signal, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Auth, authState, User, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { Router } from '@angular/router';

export type UserRole = 'Super Admin' | 'Admin' | 'Recruiter' | 'Payroll Manager';

export interface UserData {
  uid: string;
  email: string | null;
  name?: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  public currentUser = signal<User | null>(null);
  public userRole = signal<UserRole | null>(null);
  private roleListener?: Unsubscribe;

  constructor() {
    // Initialize auth listener
    authState(this.auth).subscribe(user => {
      runInInjectionContext(this.injector, () => {
        this.currentUser.set(user);
        if (user) {
          this.startRoleListener(user.uid);
        } else {
          this.stopRoleListener();
          this.userRole.set(null);
        }
      });
    });
  }

  private startRoleListener(uid: string) {
    if (this.roleListener) return;

    const userDocRef = doc(this.firestore, 'users', uid);
    this.roleListener = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        this.userRole.set(data.role);
      } else {
        console.warn('[AuthService] User document not found for UID:', uid);
        this.userRole.set(null);
      }
    }, (error) => {
      console.error('[AuthService] Failed to fetch user role:', error);
    });
  }

  private stopRoleListener() {
    if (this.roleListener) {
      this.roleListener();
      this.roleListener = undefined;
    }
  }

  async logout() {
    try {
      this.stopRoleListener();
      await signOut(this.auth);
      localStorage.clear();
      this.currentUser.set(null);
      this.userRole.set(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('[AuthService] Logout failed:', error);
    }
  }

  hasPermission(route: string): boolean {
    const role = this.userRole();
    if (!role) return false;
    if (role === 'Super Admin') return true;

    const permissions: Record<UserRole, string[]> = {
      'Super Admin': ['dash', 'emp', 'add-emp', 'attn', 'leavemng', 'pay', 'prof', 'settings'],
      'Admin': ['dash', 'emp', 'attn', 'prof', 'settings'],
      'Recruiter': ['dash', 'emp', 'add-emp', 'attn', 'prof', 'settings'],
      'Payroll Manager': ['dash', 'emp', 'attn', 'pay', 'prof', 'settings']
    };

    const allowedRoutes = permissions[role] || [];
    // Basic route matching - can be improved for nested routes
    return allowedRoutes.some(r => route.includes(r));
  }
}
