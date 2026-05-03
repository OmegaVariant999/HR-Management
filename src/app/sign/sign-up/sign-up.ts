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
  role = '';

  onSignUp(event: Event) {
    event.preventDefault();
    
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        // Return the promise to keep the chain inside the context
        return setDoc(doc(this.firestore, 'users', user.uid), {
          name: this.name,
          email: this.email,
          role: this.role || 'Recruiter', 
          status: 'Pending',
          createdAt: new Date().toISOString()
        });
      })
      .then(() => {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/dash']);
      })
      .catch((error: any) => {
        console.error("Sign up error:", error);
        alert(error.message);
      });
  }
}
