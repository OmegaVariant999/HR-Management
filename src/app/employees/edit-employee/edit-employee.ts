import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EditEmployeeData {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: string;
  address: string;
}

@Component({
  selector: 'app-edit-employee',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css',
})
export class EditEmployee {
  readonly dialogRef = inject(MatDialogRef<EditEmployee>);
  readonly data: EditEmployeeData = inject(MAT_DIALOG_DATA);

  // Editable form model (clone so we don't mutate the original until Save)
  form: EditEmployeeData = { ...this.data };

  departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
  statuses = ['Active', 'Inactive', 'On Leave'];

  save() {
    this.dialogRef.close(this.form);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
