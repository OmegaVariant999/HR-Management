
import { Component,signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  imports: [RouterLink],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee {
  currentStep = signal(1);

nextStep() {
    if (this.currentStep() < 5) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }
}
