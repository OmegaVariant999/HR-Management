import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './nav/sidebar/sidebar';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected readonly title = signal('HR_Management');
  showSidebar = signal(false);
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const isLoggedIn = !!localStorage.getItem('isLoggedIn');

      // Sidebar is hidden on auth pages: landing, login, signup
      const isAuthPage = url === '/' || url === '/login' || url === '/signup';
      this.showSidebar.set(!isAuthPage && isLoggedIn);
    });
  }

}
