import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-employee',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './delete-employee.html',
  styleUrl: './delete-employee.css'
})
export class DeleteEmployee {
  constructor(
    public dialogRef: MatDialogRef<DeleteEmployee>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  onMakeInactive(): void {
    this.dialogRef.close('inactive');
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }
}
