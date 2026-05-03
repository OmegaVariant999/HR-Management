import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
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

  onLogin(event: Event) {
    event.preventDefault();
    if (!this.email || !this.password) return;

    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isSuperAdmin = userData['role'] === 'Super Admin';
          
          // Check for approval status
          if (!isSuperAdmin && userData['status'] !== 'Approved') {
            await signOut(this.auth);
            alert("Your account is currently pending approval. Please contact a Super Admin.");
            return;
          }

          // Update last login and set online
          await updateDoc(doc(this.firestore, 'users', user.uid), {
            lastLogin: new Date().toISOString(),
            isOnline: true
          });

          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dash']);
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
