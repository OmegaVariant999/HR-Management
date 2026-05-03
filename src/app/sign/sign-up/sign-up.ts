import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

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
  private employeeService = inject(EmployeeService);

  name = '';
  email = '';
  password = '';
  role = '';

  onSignUp(event: Event) {
    event.preventDefault();
    
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        const registrationData = {
          uid: user.uid,
          name: this.name,
          email: this.email,
          role: this.role || 'Recruiter', 
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
        
        // Write to registrations instead of users
        return setDoc(doc(this.firestore, 'registrations', user.uid), registrationData);
      })
      .then(() => {
        // Log out immediately as they are not approved
        return this.auth.signOut();
      })
      .then(() => {
        alert("Registration submitted! Please wait for a Super Admin to approve your access before logging in.");
        this.router.navigate(['/login']);
      })
      .catch((error: any) => {
        console.error("Sign up error:", error);
        alert(error.message);
      });
  }
}
