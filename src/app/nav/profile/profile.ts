import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  // Mock user data based on your demographics
  userName = signal('Soumyajit Maity');
  userRole = signal('Admin / Student');
  userEmail = signal('admin@hrms.com');
  userPhone = signal('+91 9876543210');
  userLocation = signal('Kolkata, West Bengal');

  private router = inject(Router);

  goToSecurity() {
    this.router.navigate(['/settings'], { queryParams: { tab: 'security' } });
  }

  goToNotifications() {
    this.router.navigate(['/settings'], { queryParams: { tab: 'notifications' } });
  }
}
