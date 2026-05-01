import { Component, signal,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './nav/sidebar/sidebar';
import { Router,NavigationEnd} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected readonly title = signal('HR_Management');
  private router = inject(Router);
  showSidebar = true;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide sidebar if we are on the landing page ('/'), login, or signup
      this.showSidebar = !['/', '', '/login', '/signup'].includes(event.url.split('?')[0]);
    });
  }
}
