import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

export interface FilterCriteria {
  name: string;
  empId: string;
  department: string;
  designation: string;
  status: string;
}

@Component({
  selector: 'app-filter-dialog',
  imports: [MatDialogModule, FormsModule],
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.css',
})
export class FilterDialog {
  readonly dialogRef = inject(MatDialogRef<FilterDialog>);
  readonly data = inject<FilterCriteria | null>(MAT_DIALOG_DATA);

  // Initialize with passed data or empty strings
  criteria: FilterCriteria = {
    name: this.data?.name || '',
    empId: this.data?.empId || '',
    department: this.data?.department || '',
    designation: this.data?.designation || '',
    status: this.data?.status || '',
  };

  apply() {
    this.dialogRef.close(this.criteria);
  }

  clear() {
    this.criteria = {
      name: '',
      empId: '',
      department: '',
      designation: '',
      status: ''
    };
  }
}
