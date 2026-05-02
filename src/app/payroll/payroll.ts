import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { EmployeeService } from '../services/employee.service';

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
  selectedEmployee = signal<any>(null);

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

  selectEmployee(emp: any) {
    this.selectedEmployee.set(emp);
  }

  clearSelection() {
    this.selectedEmployee.set(null);
  }

  initials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  // Generates salary based on actual DB salary and requested logic
  getSalary(emp: any) {
    // Basic Salary: use actual from DB, or fallback to a deterministic value
    const base = emp.salary ? Number(emp.salary) : (30000 + (emp.name?.length || 5) * 1000);
    
    // HRA: 40% of Basic
    const hra = Math.floor(base * 0.40);
    
    // Bonus: 10% of Basic
    const bonus = Math.floor(base * 0.10);
    
    // Gross Salary (Total Earnings)
    const gross = base + hra + bonus;
    
    // PF: 12% of Basic
    const pf = Math.floor(base * 0.12);
    
    // Income Tax: 5% of Gross
    const tax = Math.floor(gross * 0.05);
    
    // Others (Deterministic "random" between 1000 and 2500 to prevent Angular binding errors)
    const nameSeed = (emp.name || 'Emp').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const others = 1000 + (nameSeed % 1500);
    
    // Total Deductions
    const deductions = pf + tax + others;
    
    // Net Pay
    const net = gross - deductions;
    
    return { 
      base, 
      hra, 
      bonus, 
      earnings: gross, 
      pf, 
      tax, 
      others, 
      deductions, 
      net 
    };
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
