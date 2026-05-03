import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, Unsubscribe } from '@angular/fire/firestore';

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  address: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private firestore = inject(Firestore);
  public employees = signal<Employee[]>([]);
  private listenerHandle?: Unsubscribe;

  constructor() {
    // this.initRealtimeListener();
  }

  public startListening() {
    // Prevent multiple listeners if already active
    if (this.listenerHandle) return;

    const colRef = collection(this.firestore, 'employees');
    this.listenerHandle = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));
      this.employees.set(data);
    }, (error) => {
      console.error('[EmployeeService] Failed to listen:', error);
    });
  }

  stopListening() {
    if (this.listenerHandle) {
      this.listenerHandle(); // Detach the Firestore real-time listener
      this.listenerHandle = undefined; // Reset handle
      this.employees.set([]); // Clear the local signal state for security
    }
  }

  async addEmployee(employeeData: any) {
    const colRef = collection(this.firestore, 'employees');

    const prefixMap: { [key: string]: string } = {
      'Engineering': 'En',
      'HR': 'Hr',
      'Finance': 'Fn',
      'Marketing': 'Mkt',
      'Sales': 'Ss',
      'Operations': 'Ot'
    };

    const prefix = prefixMap[employeeData.department] || 'Xx';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const customId = `${prefix}${randomNum}`;

    const docRef = doc(colRef, customId);
    await setDoc(docRef, employeeData);
    console.log(`[EmployeeService] Added employee with ID: ${customId}`);
  }

  async updateEmployee(id: string, updateData: Partial<Employee>) {
    const docRef = doc(this.firestore, 'employees', id);
    await updateDoc(docRef, updateData);
    console.log(`[EmployeeService] Updated employee ${id}`);
  }

  async updateEmployeeStatus(id: string, status: string) {
    const docRef = doc(this.firestore, 'employees', id);
    await updateDoc(docRef, { status });
    console.log(`[EmployeeService] Changed employee ${id} status to ${status}`);
  }

  async deleteEmployee(id: string) {
    const docRef = doc(this.firestore, 'employees', id);
    await deleteDoc(docRef);
    console.log(`[EmployeeService] Deleted employee ${id}`);
  }
}