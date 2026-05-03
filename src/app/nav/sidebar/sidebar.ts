import { CommonModule } from '@angular/common';
import { Component, inject, signal, HostListener, input, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Auth,  signOut  } from '@angular/fire/auth';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  sidebarOpen = input(false); // Input signal from parent
  isCollapsed = signal(true);
  isMobile = signal(this.isMobileView());
  private router = inject(Router);
  private auth = inject(Auth);

  constructor() {
    // Sync sidebarOpen input with isCollapsed state
    effect(() => {
      this.isCollapsed.set(!this.sidebarOpen());
    });

    // Close sidebar on mobile after successful navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobileView()) {
        // Small delay to ensure route rendering completes
        setTimeout(() => {
          this.isCollapsed.set(true);
        }, 100);
      }
    });
  }

  private isMobileView(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const isMobileNow = this.isMobileView();
    this.isMobile.set(isMobileNow);
    
    // Auto-collapse on mobile
    if (isMobileNow) {
      this.isCollapsed.set(true);
    }
  }

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  async onLogout(event: Event) {
    event.preventDefault();
    
    try {
      await signOut(this.auth);
      
      localStorage.removeItem('isLoggedIn');
      
      this.router.navigate(['/']);
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
}
