import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { ViewEmployee, ViewEmployeeData } from './view-employee/view-employee';
import { EditEmployee, EditEmployeeData } from './edit-employee/edit-employee';

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  address: string;
}

@Component({
  selector: 'app-employees',
  imports: [RouterLink],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
  private readonly dialog = inject(MatDialog);

  employees: Employee[] = [
    {
      id: '001',
      name: 'Rahul Sharma',
      department: 'Engineering',
      designation: 'Software Engineer',
      status: 'Active',
      address: '12, MG Road, Bengaluru, Karnataka – 560001',
    },
    {
      id: '002',
      name: 'Priya Singh',
      department: 'HR',
      designation: 'HR Manager',
      status: 'Active',
      address: '45, Sector 18, Noida, Uttar Pradesh – 201301',
    },
    {
      id: '003',
      name: 'Aman Verma',
      department: 'Finance',
      designation: 'Financial Analyst',
      status: 'Inactive',
      address: '7, Park Street, Kolkata, West Bengal – 700016',
    },
  ];

  /** Returns the two-letter initials for an employee name */
  initials(name: string): string {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '400px',
      panelClass: 'custom-filter-panel',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) console.log('Filters applied:', result);
    });
  }

  openView(emp: Employee) {
    this.dialog.open(ViewEmployee, {
      width: '480px',
      data: { ...emp } as ViewEmployeeData,
      panelClass: 'dark-dialog-panel',
    });
  }

  openEdit(emp: Employee) {
    const dialogRef = this.dialog.open(EditEmployee, {
      width: '500px',
      data: { ...emp } as EditEmployeeData,
      panelClass: 'dark-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((result: EditEmployeeData | null) => {
      if (result) {
        // Apply updated fields back to the employee record
        const idx = this.employees.findIndex(e => e.id === emp.id);
        if (idx !== -1) {
          this.employees[idx] = {
            ...this.employees[idx],
            department: result.department,
            designation: result.designation,
            status: result.status as 'Active' | 'Inactive' | 'On Leave',
            address: result.address,
          };
        }
      }
    });
  }
}
