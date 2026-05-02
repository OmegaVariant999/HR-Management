import { Component,signal,computed,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { EmployeeService, Employee } from '../services/employee.service';
@Component({
  selector: 'app-leave-manage',
  imports: [MatDialogModule, CommonModule, FormsModule],
  templateUrl: './leave-manage.html',
  styleUrl: './leave-manage.css',
})
export class LeaveManage {
  activeTab = signal('pending');
  private readonly dialog = inject(MatDialog);
  public employeeService = inject(EmployeeService);

  searchQuery = signal('');
  leaveStatusOverrides = signal<{ [empId: string]: string }>({});

  // Map each employee to a mock leave request
  mockLeaveRequests = computed(() => {
    return this.employeeService.employees().map(emp => {
      // Generate some stable fake data based on name length
      const isPending = emp.name.length % 2 === 0;
      const isApproved = emp.name.length % 3 === 0;
      
      const overrides = this.leaveStatusOverrides();
      const status = overrides[emp.id] ? overrides[emp.id] : (isPending ? 'pending' : (isApproved ? 'approved' : 'rejected'));
      const type = emp.name.length % 2 === 0 ? 'Casual Leave' : 'Sick Leave';
      const days = emp.name.length % 4 + 1;
      
      return {
        emp,
        type,
        days,
        status,
        reason: type === 'Sick Leave' ? 'Medical' : 'Family Function',
        from: '20 May 2025',
        to: `${20 + days} May 2025`
      };
    });
  });

  filteredLeaves = computed(() => {
    const active = this.activeTab();
    if (active === 'my-leaves') return []; // Show nothing as requested
    
    let leaves = this.mockLeaveRequests().filter(l => l.status === active);
    
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      leaves = leaves.filter(l => 
        (l.emp.name && l.emp.name.toLowerCase().includes(query)) ||
        (l.emp.id && l.emp.id.toLowerCase().includes(query)) ||
        (l.emp.department && l.emp.department.toLowerCase().includes(query)) ||
        (l.emp.designation && l.emp.designation.toLowerCase().includes(query))
      );
    }
    return leaves;
  });

  initials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  approveLeave(leave: any) {
    this.leaveStatusOverrides.update(opts => ({ ...opts, [leave.emp.id]: 'approved' }));
    this.employeeService.updateEmployeeStatus(leave.emp.id, 'On Leave');
  }

  rejectLeave(leave: any) {
    this.leaveStatusOverrides.update(opts => ({ ...opts, [leave.emp.id]: 'rejected' }));
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
