import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  email: string = '';
  password: string = '';
  role: string = '';

onLogin(event: Event) {
    event.preventDefault();
    if (!this.email || !this.password) return;

    // Use .then() instead of await to maintain Injection Context
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData['role'] === this.role) {
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/dash']);
          } else {
            await signOut(this.auth);
            alert(`Access Denied: Your assigned role is ${userData['role']}, but you selected ${this.role}.`);
          }
        } else {
          await signOut(this.auth);
          alert("User record not found. Please contact support.");
        }
      })
      .catch((error: any) => {
        console.error("Login error:", error);
        alert("Invalid email or password.");
      });
  }
}

