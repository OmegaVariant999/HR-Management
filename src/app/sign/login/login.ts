import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  email: string = '';
  password: string = '';

  onLogin(event: Event) {
    event.preventDefault();
    if (this.email === 'test@123.com' && this.password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/dash']);
    } else {
      alert('Invalid credentials');
    }
  }
}

