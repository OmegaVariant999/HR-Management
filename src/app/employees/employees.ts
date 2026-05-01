import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../filter-dialog/filter-dialog';
import { ViewEmployee, ViewEmployeeData } from './view-employee/view-employee';
import { EditEmployee, EditEmployeeData } from './edit-employee/edit-employee';
import { DeleteEmployee } from './delete-employee/delete-employee';
import { Firestore, collection, onSnapshot, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

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
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  private readonly dialog = inject(MatDialog);
  private firestore = inject(Firestore);

  employees = signal<any[]>([]);

  ngOnInit() {
    const colRef = collection(this.firestore, 'employees');

    // Use native Firebase onSnapshot to avoid AngularFire wrapper type conflicts
    onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Success! Firebase data via onSnapshot:', data);
      this.employees.set(data);
    }, (error) => {
      console.error('Firestore subscription error:', error);
    });
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
        const currentEmployees = this.employees();
        const idx = currentEmployees.findIndex(e => e.id === emp.id);
        if (idx !== -1) {
          const updatedEmployees = [...currentEmployees];
          updatedEmployees[idx] = {
            ...updatedEmployees[idx],
            department: result.department,
            designation: result.designation,
            status: result.status as 'Active' | 'Inactive' | 'On Leave',
            address: result.address,
          };
          this.employees.set(updatedEmployees);
        }
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
      
      const docRef = doc(this.firestore, 'employees', emp.id);

      try {
        if (result === 'inactive') {
          await updateDoc(docRef, { status: 'Inactive' });
          console.log(`Employee ${emp.id} marked as Inactive`);
        } else if (result === 'delete') {
          await deleteDoc(docRef);
          console.log(`Employee ${emp.id} permanently deleted`);
        }
      } catch (error) {
        console.error('Error updating/deleting employee:', error);
      }
    });
  }
}