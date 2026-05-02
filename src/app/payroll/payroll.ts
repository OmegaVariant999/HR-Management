import { Component,inject,signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { EmployeeService } from '../services/employee.service';
import { FilterDialog } from '../filter-dialog/filter-dialog';

@Component({
  selector: 'app-payroll',
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
})
export class Payroll {
    private readonly dialog = inject(MatDialog);
    public employeeService = inject(EmployeeService);

  viewDate = signal(new Date());
  searchQuery = signal('');

  filteredPayroll = computed(() => {
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

  // Generates stable random numbers for payslips based on employee name
  getSalary(emp: any) {
    const base = 30000 + (emp.name.length * 1000);
    const hra = Math.floor(base * 0.25);
    const bonus = 2000;
    const pf = Math.floor(base * 0.08);
    const tax = Math.floor(base * 0.1);
    const others = 840;
    
    const earnings = base + hra + bonus;
    const deductions = pf + tax + others;
    const net = earnings - deductions;
    
    return { base, hra, bonus, pf, tax, others, earnings, deductions, net };
  }

  // Dynamically format the month and year
  monthDisplay = computed(() => {
    return this.viewDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

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
