import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private auth = inject(Auth);
  email: string = '';
  password: string = '';

async onLogin(event: Event) {
    event.preventDefault();
    if (!this.email || !this.password) return;
    try {
      // Firebase verifies the credentials against the stored Auth data
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => {
        this.router.navigate(['/dash']);
      }, 100);
    } catch (error: any) {
      console.error("Login error:", error);
      alert("Invalid email or password.");
    }
  }
}

