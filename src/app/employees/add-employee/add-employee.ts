import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
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

      const prefixMap: { [key: string]: string } = {
        'Engineering': 'En',
        'HR': 'Hr',
        'Finance': 'Fn',
        'Marketing': 'Mkt',
        'Sales': 'Ss',
        'Operations': 'Ot'
      };
      
      const prefix = prefixMap[this.employee.department] || 'Xx';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const customId = `${prefix}${randomNum}`;

      // Save the object using the custom ID as the document ID
      const docRef = doc(colRef, customId);
      await setDoc(docRef, this.employee);

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