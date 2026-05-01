import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isCollapsed = signal(false);
  private router = inject(Router);

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onLogout(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
