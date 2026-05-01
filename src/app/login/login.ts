import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth   = inject(AuthService);
  private router = inject(Router);

  email    = '';
  password = '';
  showPw   = signal(false);
  error    = signal('');
  loading  = signal(false);

  togglePw() {
    this.showPw.set(!this.showPw());
  }

  submit() {
    this.error.set('');

    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password.');
      return;
    }

    this.loading.set(true);

    // Simulate a brief network delay for UX realism
    setTimeout(() => {
      const ok = this.auth.login(this.email, this.password);
      this.loading.set(false);

      if (ok) {
        this.router.navigate(['/dash']);
      } else {
        this.error.set('Invalid email or password. Please try again.');
      }
    }, 600);
  }
}
