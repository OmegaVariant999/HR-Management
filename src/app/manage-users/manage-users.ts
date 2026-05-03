import { Component, inject, signal, OnInit } from '@angular/core';
import { Firestore, collection, onSnapshot, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { AuthService, UserData } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditUserDialog } from './edit-user-dialog';

// Status Logic Helper
export function getUserActivityStatus(user: UserData): string {
  if (user.isOnline) return 'Online';
  
  if (user.lastLogout) {
    const lastLogout = new Date(user.lastLogout);
    const diffMins = (new Date().getTime() - lastLogout.getTime()) / (1000 * 60);
    
    if (diffMins < 30) return 'Was Online';
    if (diffMins < 60) return 'Recently Active';
    return 'Offline';
  }

  return 'Offline';
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
  
  users = signal<UserData[]>([]);
  searchFilter = '';

  ngOnInit() {
    const usersCol = collection(this.firestore, 'users');
    onSnapshot(usersCol, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      } as UserData));
      this.users.set(userData);
    }, (error) => {
      console.error('[ManageUsers] Permission Denied or Fetch Error:', error);
    });
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

  async openEditDialog(user: UserData) {
    const dialogRef = this.dialog.open(EditUserDialog, {
      width: '400px',
      data: { ...user },
      panelClass: 'dark-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const userDocRef = doc(this.firestore, 'users', user.uid);
        await updateDoc(userDocRef, { 
          role: result.role,
          status: result.status 
        });
      }
    });
  }

  async approveUser(uid: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    await updateDoc(userDocRef, { status: 'Approved' });
  }

  async rejectUser(uid: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    await updateDoc(userDocRef, { status: 'Rejected' });
  }

  async deleteUser(uid: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      const userDocRef = doc(this.firestore, 'users', uid);
      await deleteDoc(userDocRef);
    }
  }

  initials(name: string | undefined): string {
    if (!name || !name.trim()) return '??';
    const parts = name.trim().split(/\s+/);
    return parts.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
