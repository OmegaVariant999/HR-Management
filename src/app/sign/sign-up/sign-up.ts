import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private router = inject(Router);

  onSignUp(event: Event) {
    event.preventDefault(); // Prevent actual form submission
    this.router.navigate(['/dash']);
  }
}
