import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { EmployeeService } from '../services/employee.service';
@Component({
  selector: 'app-attendence',
  imports: [CommonModule, FormsModule],
  templateUrl: './attendence.html',
  styleUrl: './attendence.css',
})
export class Attendence {
  private readonly dialog = inject(MatDialog);
  public employeeService = inject(EmployeeService);

  searchQuery = signal('');

  // Combine mock attendance with real employees
  filteredAttendance = computed(() => {
    let emps = this.employeeService.employees();
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      emps = emps.filter(emp =>
        (emp.name && emp.name.toLowerCase().includes(query)) ||
        (emp.id && emp.id.toLowerCase().includes(query)) ||
        (emp.department && emp.department.toLowerCase().includes(query)) ||
        (emp.designation && emp.designation.toLowerCase().includes(query))
      );
    }
    return emps;
  });

  initials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '500px',
      panelClass: 'dark-dialog-panel'
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
