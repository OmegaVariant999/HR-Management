import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.css'
})
export class ApplyLeave {
  private authService = inject(AuthService);
  private leaveService = inject(LeaveService);
  private router = inject(Router);

  leaveType = signal<'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity Leave' | 'Paternity Leave'>('Annual Leave');
  reason = signal('');
  fromDate = signal('');
  toDate = signal('');

  leaveQuotas = {
    'Annual Leave': 18,
    'Sick Leave': 12,
    'Casual Leave': 6,
    'Maternity Leave': 182,
    'Paternity Leave': 15
  };

  async submitLeave() {
    const user = this.authService.userData();
    if (!user) return;

    const from = new Date(this.fromDate());
    const to = new Date(this.toDate());
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      alert('Invalid date range');
      return;
    }

    await this.leaveService.applyForLeave({
      employeeId: user.uid,
      employeeName: user.name || 'Anonymous',
      type: this.leaveType(),
      reason: this.reason(),
      fromDate: this.fromDate(),
      toDate: this.toDate(),
      days: days
    });

    this.router.navigate(['/prof']);
  }

  cancel() {
    this.router.navigate(['/prof']);
  }
}
