import { Component,signal,computed,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
@Component({
  selector: 'app-attendence',
  imports: [],
  templateUrl: './attendence.html',
  styleUrl: './attendence.css',
})
export class Attendence {
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
  // Initialize with the current date
viewDate = signal(new Date());

  monthDisplay = computed(() => {
    return this.viewDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  // Calculate days in the current viewed month
  daysInMonth = computed(() => {
    const date = this.viewDate();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  });

  // Helper to generate array for @for loop
  getDaysArray = computed(() => {
    return Array.from({ length: this.daysInMonth() }, (_, i) => i + 1);
  });

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
