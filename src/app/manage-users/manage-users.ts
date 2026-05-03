import { Component, inject, signal, OnInit } from '@angular/core';
import { Firestore, collection, onSnapshot, doc, updateDoc, deleteDoc, Unsubscribe, setDoc } from '@angular/fire/firestore';
import { AuthService, UserData } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditUserDialog } from './edit-user-dialog';
import { EmployeeService } from '../services/employee.service';

// Status Logic Helper
export function getUserActivityStatus(user: UserData): string {
  if (user.isOnline) return 'Online';

  if (user.lastLogout) {
    const lastLogout = new Date(user.lastLogout);
    const diffMins = (new Date().getTime() - lastLogout.getTime()) / (1000 * 60);

    // User is "Offline" for first 10 mins after logout, then "Inactive"
    if (diffMins < 10) return 'Offline';
    return 'Inactive';
  }

  return 'Inactive';
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css'
})
export class ManageUsers implements OnInit {
  private firestore = inject(Firestore);
  private dialog = inject(MatDialog);
  public authService = inject(AuthService);
  private employeeService = inject(EmployeeService);

  users = signal<UserData[]>([]);
  pendingRegistrations = signal<UserData[]>([]);
  searchFilter = '';
  private isMigrationRunning = false;
  private registrationsListener?: Unsubscribe;
  private lastSyncTime = 0;

  ngOnInit() {
    const usersCol = collection(this.firestore, 'users');
    onSnapshot(usersCol, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      } as UserData));

      this.users.set(userData);

      // Prevent recursive loops by checking time since last sync
      const now = Date.now();
      if (!this.isMigrationRunning && (now - this.lastSyncTime > 10000)) {
        this.lastSyncTime = now;
        this.runSync(userData);
      }
    }, (error) => {
      console.error('[ManageUsers] Users Fetch Error:', error);
    });

    // Listen to registrations
    const regsCol = collection(this.firestore, 'registrations');
    this.registrationsListener = onSnapshot(regsCol, (snapshot) => {
      const regData = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      } as UserData));
      this.pendingRegistrations.set(regData);
    });
  }

  async runSync(userData: UserData[]) {
    this.isMigrationRunning = true;
    try {
      for (const user of userData) {
        // Only sync if they are Approved or if we want all users in the list
        // Based on user request: "All users that signed up... should be listed"
        await this.employeeService.syncUserToEmployee(user.uid, user);
      }
    } catch (e) {
      console.error('[ManageUsers] Migration failed:', e);
    } finally {
      // Keep it true for a while to prevent loops during the initial mass-write
      setTimeout(() => this.isMigrationRunning = false, 5000);
    }
  }

  filteredUsers() {
    const query = this.searchFilter.toLowerCase().trim();
    return this.users().filter(u =>
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  }

  displayStatus(user: UserData): string {
    return getUserActivityStatus(user);
  }

  isRecentlyApproved(user: UserData): boolean {
    if (!user.approvedAt) return false;
    const approvedAt = new Date(user.approvedAt);
    const diffSeconds = (new Date().getTime() - approvedAt.getTime()) / 1000;
    return diffSeconds < 10;
  }

  async openEditDialog(user: UserData) {
    const dialogRef = this.dialog.open(EditUserDialog, {
      width: '450px',
      data: { ...user },
      panelClass: 'dark-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (result.action === 'delete') {
          await this.deleteUser(user.uid);
          return;
        }

        const userDocRef = doc(this.firestore, 'users', user.uid);
        const updates: any = {
          role: result.role,
          status: result.status
        };

        if (result.status === 'Approved' && user.status !== 'Approved') {
          updates.approvedAt = new Date().toISOString();
        }

        await updateDoc(userDocRef, updates);

        // Immediate Sync
        await this.employeeService.syncUserToEmployee(user.uid, {
          ...user,
          ...updates
        });
      }
    });
  }

  async approveRegistration(reg: UserData) {
    try {
      const userDocRef = doc(this.firestore, 'users', reg.uid);
      const updates: UserData = {
        ...reg,
        status: 'Approved',
        approvedAt: new Date().toISOString()
      };

      // 1. Move to users
      await setDoc(userDocRef, updates);

      // 2. Sync to employees
      await this.employeeService.syncUserToEmployee(reg.uid, updates);

      // 3. Delete from registrations
      await deleteDoc(doc(this.firestore, 'registrations', reg.uid));

      console.log(`[ManageUsers] Approved registration for ${reg.email}`);
    } catch (e) {
      console.error('[ManageUsers] Approval failed:', e);
    }
  }

  async rejectRegistration(reg: UserData) {
    if (confirm(`Reject and delete registration for ${reg.name}?`)) {
      await deleteDoc(doc(this.firestore, 'registrations', reg.uid));
    }
  }

  async approveUser(uid: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    const updates = {
      status: 'Approved',
      approvedAt: new Date().toISOString()
    };
    await updateDoc(userDocRef, updates);

    const user = this.users().find(u => u.uid === uid);
    if (user) {
      await this.employeeService.syncUserToEmployee(uid, { ...user, ...updates });
    }
  }

  async rejectUser(uid: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    const updates = { status: 'Rejected' };
    await updateDoc(userDocRef, updates);

    const user = this.users().find(u => u.uid === uid);
    if (user) {
      await this.employeeService.syncUserToEmployee(uid, { ...user, ...updates });
    }
  }

  async deleteUser(uid: string) {
    const user = this.users().find(u => u.uid === uid);
    if (confirm(`Are you sure you want to permanently delete ${user?.name || uid}? This action cannot be undone.`)) {
      const userDocRef = doc(this.firestore, 'users', uid);
      await deleteDoc(userDocRef);

      if (user?.employeeId) {
        await this.employeeService.deleteEmployee(user.employeeId);
      } else {
        await this.employeeService.deleteEmployee(uid);
      }
    }
  }

  initials(name: string | undefined): string {
    if (!name || !name.trim()) return '??';
    const parts = name.trim().split(/\s+/);
    return parts.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
