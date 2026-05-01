import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee {
  currentStep = signal(1);
  private firestore = inject(Firestore);
  private router = inject(Router);

  employee = {
    name: '',
    phone: '',
    email: '',
    gender: '',
    dob: '',
    maritalStatus: 'single',
    address: '',
    department: 'Engineering',
    designation: '',
    type: 'Full Time',
    joinDate: '',
    salary: null,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    status: 'Active'
  };

  async onSubmit() {
    try {
      const colRef = collection(this.firestore, 'employees');

      // Save the object bound to the form
      await addDoc(colRef, this.employee);

      // Successful save, navigate back
      this.router.navigate(['/emp']);
    } catch (error) {
      console.error("Error adding employee: ", error);
      alert("Failed to save employee. Check console.");
    }
  }

  nextStep() {
    if (this.currentStep() < 5) this.currentStep.update(s => s + 1);
  }

  prevStep() {
    if (this.currentStep() > 1) this.currentStep.update(s => s - 1);
  }
}