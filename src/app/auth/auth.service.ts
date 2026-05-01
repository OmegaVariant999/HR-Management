import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'hr_auth_token';

  // Reactive login state — true if a token exists in localStorage
  isLoggedIn = signal<boolean>(this.hasToken());

  constructor(private router: Router) {}

  private hasToken(): boolean {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      return !!localStorage.getItem(this.STORAGE_KEY);
    }
    return false;
  }

  /**
   * Validates credentials and stores a session token.
   * Returns true on success, false on failure.
   */
  login(email: string, password: string): boolean {
    // Demo credentials — swap for a real API call in production
    if (email === 'admin@acmecorp.in' && password === 'admin123') {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, 'demo-jwt-token');
      }
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
