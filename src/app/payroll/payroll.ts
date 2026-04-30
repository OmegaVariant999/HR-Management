import { Component,inject,signal,computed } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';

@Component({
  selector: 'app-payroll',
  imports: [],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
})
export class Payroll {
    private readonly dialog = inject(MatDialog);
    // Initialize with the actual current date
  viewDate = signal(new Date());

  // Dynamically format the month and year
  monthDisplay = computed(() => {
    return this.viewDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

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

  // Logic to move between payroll periods
  nextMonth() {
    this.viewDate.update(date => {
      const next = new Date(date);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }

  prevMonth() {
    this.viewDate.update(date => {
      const prev = new Date(date);
      prev.setMonth(prev.getMonth() - 1);
      return prev;
    });
  }

}
