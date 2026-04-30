import { Component,signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-attendence',
  imports: [],
  templateUrl: './attendence.html',
  styleUrl: './attendence.css',
})
export class Attendence {
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
