import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);

  onLogin(event: Event) {
    event.preventDefault(); // Prevent actual form submission
    this.router.navigate(['/dash']);
  }
}
