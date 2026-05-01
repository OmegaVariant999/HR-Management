import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { ViewEmployee, ViewEmployeeData } from './view-employee/view-employee';
import { EditEmployee, EditEmployeeData } from './edit-employee/edit-employee';
import { DeleteEmployee } from './delete-employee/delete-employee';
import { EmployeeService, Employee } from '../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  private readonly dialog = inject(MatDialog);
  public employeeService = inject(EmployeeService);

  // Expose the global signal for the template to bind to
  employees = this.employeeService.employees;

  ngOnInit() {
    // The service automatically handles onSnapshot initialization
  }

  initials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
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
        this.employeeService.updateEmployee(emp.id, {
          department: result.department,
          designation: result.designation,
          status: result.status as 'Active' | 'Inactive' | 'On Leave',
          address: result.address,
        });
      }
    });
  }

  async openDelete(emp: Employee) {
    const dialogRef = this.dialog.open(DeleteEmployee, {
      width: '450px',
      data: { ...emp },
      panelClass: 'dark-dialog-panel',
    });

    dialogRef.afterClosed().subscribe(async (result: string) => {
      if (!result || result === 'cancel') return;
      
      try {
        if (result === 'inactive') {
          await this.employeeService.updateEmployeeStatus(emp.id, 'Inactive');
        } else if (result === 'delete') {
          await this.employeeService.deleteEmployee(emp.id);
        }
      } catch (error) {
        console.error('Error updating/deleting employee:', error);
      }
    });
  }
}