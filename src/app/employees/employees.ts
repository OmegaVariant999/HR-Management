import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog, FilterCriteria } from '../filter-dialog/filter-dialog';
import { ViewEmployee, ViewEmployeeData } from './view-employee/view-employee';
import { EditEmployee, EditEmployeeData } from './edit-employee/edit-employee';
import { DeleteEmployee } from './delete-employee/delete-employee';
import { EmployeeService, Employee } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  private readonly dialog = inject(MatDialog);
  public employeeService = inject(EmployeeService);

  // Filter state
  currentFilters = signal<FilterCriteria | null>(null);
  // Search state
  searchQuery = signal('');

  // Reactively derived filtered list
  filteredEmployees = computed(() => {
    let allEmps = this.employeeService.employees();
    
    // 1. Text Search Filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      allEmps = allEmps.filter(emp => 
        (emp.name && emp.name.toLowerCase().includes(query)) ||
        (emp.id && emp.id.toLowerCase().includes(query)) ||
        (emp.department && emp.department.toLowerCase().includes(query)) ||
        (emp.designation && emp.designation.toLowerCase().includes(query))
      );
    }

    // 2. Advanced Filter Dialog
    const filters = this.currentFilters();
    if (!filters) return allEmps;

    return allEmps.filter(emp => {
      // Name
      if (filters.name && !emp.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      // ID
      if (filters.empId && !emp.id.toLowerCase().includes(filters.empId.toLowerCase())) return false;
      // Department
      if (filters.department && emp.department.toLowerCase() !== filters.department.toLowerCase()) return false;
      // Designation
      if (filters.designation && !emp.designation.toLowerCase().includes(filters.designation.toLowerCase())) return false;
      // Status
      if (filters.status && emp.status.toLowerCase() !== filters.status.toLowerCase()) return false;

      return true;
    });
  });

  ngOnInit() {
    // The service automatically handles onSnapshot initialization
  }

  initials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '500px',
      panelClass: 'dark-dialog-panel',
      data: this.currentFilters() // Pass existing filters in
    });
    
    dialogRef.afterClosed().subscribe((result: FilterCriteria | null | undefined) => {
      if (result) {
        // If clear() was clicked, result will have empty strings which is basically clearing filters
        const isCleared = !result.name && !result.empId && !result.department && !result.designation && !result.status;
        this.currentFilters.set(isCleared ? null : result);
      }
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