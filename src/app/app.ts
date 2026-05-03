import { Component, signal, inject, HostListener, ViewChild, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './nav/sidebar/sidebar';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TransitionService } from './services/transition.service';
import { EmployeeService } from './services/employee.service';
import { Auth, authState } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected readonly title = signal('HR_Management');
  showSidebar = signal(false);
  sidebarOpen = signal(false);
  isMobile = signal(this.isMobileView());
  private injector = inject(EnvironmentInjector);
  private router = inject(Router);
  public transitionService = inject(TransitionService);
  private employeeService = inject(EmployeeService);
  private auth = inject(Auth);
  private authService = inject(AuthService);
  
  @ViewChild(Sidebar) sidebarComponent?: Sidebar;

  constructor() {
    authState(this.auth).subscribe(user => {
      runInInjectionContext(this.injector, () => {
        if (user) {
          this.employeeService.startListening();
        } else {
          this.employeeService.stopListening();
        }
      });
    });
    
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const urlPath = event.urlAfterRedirects.split('?')[0].split('#')[0];
      const isLoggedIn = !!localStorage.getItem('isLoggedIn');

      // Define all public facing pages where the sidebar should NEVER show
      const publicRoutes = ['/', '/login', '/signup', '/features', '/solutions', '/pricing'];
      const isPublicRoute = publicRoutes.includes(urlPath);

      this.showSidebar.set(!isPublicRoute && isLoggedIn);
      
      // Close sidebar on mobile after navigation
      if (this.isMobileView()) {
        setTimeout(() => {
          this.sidebarOpen.set(false);
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
  }

  toggleMobileMenu(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
    if (this.sidebarComponent) {
      this.sidebarComponent.toggleSidebar();
    }
  }
}
