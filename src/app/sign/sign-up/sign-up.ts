import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink,FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  async onSignUp(event: Event) {
    event.preventDefault();
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      // 2. Store additional data in Firestore using the Auth UID
      await setDoc(doc(this.firestore, 'users', user.uid), {
        name: this.name,
        email: this.email,
        role: 'Admin', // Default role
        createdAt: new Date().toISOString()
      });

      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/dash']);
    } catch (error: any) {
      console.error("Sign up error:", error);
      alert(error.message);
    }
  }
}
