import { Component,inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  imports: [MatDialogModule],
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.css',
})
export class FilterDialog {
  readonly dialogRef = inject(MatDialogRef<FilterDialog>);

  apply() {
    // Collect form data here and pass back to parent
    this.dialogRef.close({ applied: true });
  }
}
