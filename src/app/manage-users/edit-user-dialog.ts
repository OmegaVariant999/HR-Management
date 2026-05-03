import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRole } from '../services/auth.service';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="edit-dialog">
      <div class="dialog-header">
        <div class="header-info">
          <h2 class="dialog-title">Modify Permissions</h2>
          <p class="dialog-subtitle">Adjusting access for <span>{{ data.name }}</span></p>
        </div>
        <button class="close-x" (click)="onCancel()">&times;</button>
      </div>

      <div class="dialog-body">
        <!-- Role Selection -->
        <div class="input-group">
          <label class="group-label">Organizational Role</label>
          <div class="select-wrapper">
            <select [(ngModel)]="role" class="premium-select">
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Payroll Manager">Payroll Manager</option>
            </select>
            <div class="select-arrow">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        <!-- Status Selection -->
        <div class="input-group">
          <label class="group-label">Account Privilege</label>
          <div class="status-options">
            <div class="status-option pending" [class.active]="status === 'Pending'" (click)="status = 'Pending'">
              <div class="radio-circle"></div>
              <div class="option-text">
                <span class="main">Pending Review</span>
                <span class="sub">Sign-up request is currently being processed.</span>
              </div>
            </div>
            <div class="status-option" [class.active]="status === 'Approved'" (click)="status = 'Approved'">
              <div class="radio-circle"></div>
              <div class="option-text">
                <span class="main">Active Access</span>
                <span class="sub">User can log in and view permitted modules.</span>
              </div>
            </div>
            <div class="status-option reject" [class.active]="status === 'Rejected'" (click)="status = 'Rejected'">
              <div class="radio-circle"></div>
              <div class="option-text">
                <span class="main">Suspended / Rejected</span>
                <span class="sub">User access is immediately revoked.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="footer-btn delete" (click)="onDelete()">Delete Member</button>
        <div class="spacer"></div>
        <button class="footer-btn ghost" (click)="onCancel()">Dismiss</button>
        <button class="footer-btn primary" (click)="onSave()">Update Account</button>
      </div>
    </div>
  `,
  styles: [`
    .edit-dialog { 
      background: #0f172a; 
      color: #f1f5f9; 
      border-radius: 16px; 
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid #1e293b;
    }

    .dialog-header {
      padding: 24px 32px;
      background: #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #334155;
    }

    .dialog-title { font-size: 18px; font-weight: 700; color: #f8fafc; margin: 0; }
    .dialog-subtitle { font-size: 13px; color: #94a3b8; margin: 4px 0 0; }
    .dialog-subtitle span { color: #3b82f6; font-weight: 600; }

    .close-x { background: none; border: none; color: #64748b; font-size: 24px; cursor: pointer; padding: 0; line-height: 1; }
    .close-x:hover { color: #f8fafc; }

    .dialog-body { padding: 32px; display: flex; flex-direction: column; gap: 24px; }

    .input-group { display: flex; flex-direction: column; gap: 8px; }
    .group-label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }

    /* Premium Select */
    .select-wrapper { position: relative; width: 100%; }
    .premium-select {
      width: 100%; padding: 12px 16px; background: #1e293b; border: 1px solid #334155; 
      border-radius: 10px; color: #f1f5f9; font-size: 14px; appearance: none; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .premium-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
    .select-arrow { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; width: 14px; height: 14px; }

    /* Status Options */
    .status-options { display: flex; flex-direction: column; gap: 12px; }
    .status-option {
      display: flex; align-items: flex-start; gap: 14px; padding: 14px;
      background: #1e293b; border: 1px solid #334155; border-radius: 12px;
      cursor: pointer; transition: all 0.2s;
    }
    .status-option:hover { border-color: #475569; }
    .status-option.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
    .status-option.reject.active { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
    .status-option.pending.active { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }

    .radio-circle { 
      width: 18px; height: 18px; border-radius: 50%; border: 2px solid #475569; 
      margin-top: 2px; flex-shrink: 0; position: relative; 
    }
    .status-option.active .radio-circle { border-color: #3b82f6; }
    .status-option.reject.active .radio-circle { border-color: #ef4444; }
    .status-option.pending.active .radio-circle { border-color: #f59e0b; }
    .status-option.active .radio-circle::after {
      content: ''; position: absolute; width: 8px; height: 8px; background: #3b82f6; 
      border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);
    }
    .status-option.reject.active .radio-circle::after { background: #ef4444; }
    .status-option.pending.active .radio-circle::after { background: #f59e0b; }

    .option-text { display: flex; flex-direction: column; }
    .option-text .main { font-size: 14px; font-weight: 600; color: #f1f5f9; }
    .option-text .sub { font-size: 12px; color: #64748b; margin-top: 2px; }

    .dialog-footer {
      padding: 24px 32px; background: #1e293b; border-top: 1px solid #334155;
      display: flex; align-items: center; gap: 12px;
    }

    .spacer { flex: 1; }

    .footer-btn { padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .footer-btn.ghost { background: transparent; border: 1px solid #334155; color: #94a3b8; }
    .footer-btn.ghost:hover { background: #0f172a; color: #f1f5f9; }
    .footer-btn.primary { background: #3b82f6; border: none; color: white; }
    .footer-btn.primary:hover { background: #2563eb; transform: translateY(-1px); }
    .footer-btn.delete { background: transparent; border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; }
    .footer-btn.delete:hover { background: #450a0a; border-color: #ef4444; color: white; }

    ::ng-deep .mat-mdc-dialog-container { padding: 0 !important; border-radius: 16px !important; }
  `]
})
export class EditUserDialog {
  role: UserRole;
  status: string;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.role = data.role;
    this.status = data.status;
  }

  onCancel() { this.dialogRef.close(); }
  onDelete() { this.dialogRef.close({ action: 'delete' }); }
  onSave() { this.dialogRef.close({ role: this.role, status: this.status }); }
}
