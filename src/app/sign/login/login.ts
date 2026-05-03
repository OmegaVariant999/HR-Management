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
        const userRef = doc(this.firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isSuperAdmin = userData['role'] === 'Super Admin';
          
          if (!isSuperAdmin && userData['status'] !== 'Approved') {
            await signOut(this.auth);
            alert("Your account is currently pending approval. Please contact a Super Admin.");
            return;
          }

          // Update last login and set online in Users
          await updateDoc(userRef, {
            lastLogin: new Date().toISOString(),
            isOnline: true
          });

          // Sync to Employees
          if (userData['employeeId']) {
            await updateDoc(doc(this.firestore, 'employees', userData['employeeId']), {
              isOnline: true
            }).catch(() => {});
          }

          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dash']);
        } else {
          // Check if it's a pending registration
          const regDoc = await getDoc(doc(this.firestore, 'registrations', user.uid));
          if (regDoc.exists()) {
            await signOut(this.auth);
            alert("Your registration is still pending approval. Please wait for a Super Admin to grant you access.");
          } else {
            await signOut(this.auth);
            alert("Account record not found. If you just signed up, please wait for approval.");
          }
        }
      })
      .catch((error: any) => {
        console.error("Login error:", error);
        alert("Invalid email or password.");
      });
  }
}
