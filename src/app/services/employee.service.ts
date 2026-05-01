import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  address: string;
  [key: string]: any; // for other fields like salary, bank details, etc.
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private firestore = inject(Firestore);
  
  // Global Signal holding the live employee data
  public employees = signal<Employee[]>([]);

  constructor() {
    this.initRealtimeListener();
  }

  private initRealtimeListener() {
    const colRef = collection(this.firestore, 'employees');
    
    onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
      
      console.log('[EmployeeService] Global data synced from Firestore:', data);
      this.employees.set(data);
    }, (error) => {
      console.error('[EmployeeService] Failed to listen to employees:', error);
    });
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
