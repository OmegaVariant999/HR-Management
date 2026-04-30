import { Component,inject } from '@angular/core';
import { RouterLink} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';

@Component({
  selector: 'app-employees',
  imports: [RouterLink],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
    private readonly dialog = inject(MatDialog);
  
  openFilter() {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '400px',
      panelClass: 'custom-filter-panel' // For custom Tailwind styling
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Filters applied:', result);
        // Refresh your table data here
      }
    });
  }
}
