import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ViewEmployeeData {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  address: string;
}

@Component({
  selector: 'app-view-employee',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './view-employee.html',
  styleUrl: './view-employee.css',
})
export class ViewEmployee {
  readonly dialogRef = inject(MatDialogRef<ViewEmployee>);
  readonly data: ViewEmployeeData = inject(MAT_DIALOG_DATA);

  get initials(): string {
    return this.data.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
