import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { EmployeeService, Employee } from '../services/employee.service';
import { LeaveService } from '../services/leave.service';
@Component({
  selector: 'app-leave-manage',
  imports: [MatDialogModule, CommonModule, FormsModule],
  templateUrl: './leave-manage.html',
  styleUrl: './leave-manage.css',
})
export class LeaveManage {
  activeTab = signal('pending');
  public leaveService = inject(LeaveService);
  private readonly dialog = inject(MatDialog);
  public employeeService = inject(EmployeeService);

  searchQuery = signal('');

  filteredLeaves = computed(() => {
    const active = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();
    
    let leaves = this.leaveService.leaves().filter(l => l.status === active);

    if (query) {
      leaves = leaves.filter(l =>
        l.employeeName.toLowerCase().includes(query) ||
        l.type.toLowerCase().includes(query) ||
        l.reason.toLowerCase().includes(query)
      );
    }
    return leaves;
  });

  async approveLeave(leave: any) {
    await this.leaveService.updateLeaveStatus(leave.id, 'approved');
    // Also update employee status if possible
    const emp = this.employeeService.employees().find(e => e.id === leave.employeeId);
    if (emp) {
      this.employeeService.updateEmployeeStatus(emp.id, 'On Leave');
    }
  }

  async rejectLeave(leave: any) {
    await this.leaveService.updateLeaveStatus(leave.id, 'rejected');
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
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
}
