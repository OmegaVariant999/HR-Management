import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, Unsubscribe } from '@angular/fire/firestore';

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  address: string;
  isOnline?: boolean;
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

  getDesignationFromRole(role: string): string {
    switch (role) {
      case 'Super Admin': return 'Chief HR Officer';
      case 'Admin': return 'HR Manager';
      case 'Recruiter': return 'Recruitment Lead';
      case 'Payroll Manager': return 'Payroll Specialist';
      default: return 'HR Associate';
    }
  }

  async syncUserToEmployee(uid: string, userData: any) {
    let empId = userData.employeeId;
    
    // 1. If no ID yet, generate and save it
    if (!empId) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      empId = `HR${randomNum}`;
      
      const userDocRef = doc(this.firestore, 'users', uid);
      await updateDoc(userDocRef, { employeeId: empId });
      console.log(`[EmployeeService] Created NEW ID ${empId} for user ${uid}`);
    }

    // 2. ALWAYS try to delete legacy record (where ID == UID) if it's different from our custom ID
    if (empId !== uid) {
      const legacyRef = doc(this.firestore, 'employees', uid);
      await deleteDoc(legacyRef).catch(() => {});
    }

    // 3. Upsert the employee record under the HRxxxx ID
    const docRef = doc(this.firestore, 'employees', empId);
    const empData = {
      id: empId,
      name: userData.name || 'Unnamed',
      email: userData.email || '',
      department: 'HR',
      designation: this.getDesignationFromRole(userData.role),
      status: userData.status === 'Approved' ? 'Active' : 'Inactive',
      isOnline: userData.isOnline || false, // Sync online status
      photoURL: userData.photoURL || '',
      address: userData.location || '',
      phone: userData.phone || '',
      accountNumber: userData.accountNumber || '',
      bankName: userData.bankName || '',
      ifscCode: userData.ifscCode || '',
      dob: userData.dob || '',
      gender: userData.gender || '',
      joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
      maritalStatus: userData.maritalStatus || '',
      salary: userData.salary || 0,
      systemUid: uid,
      type: 'System User'
    };
    
    await setDoc(docRef, empData, { merge: true });
    console.log(`[EmployeeService] Synced ${empId} successfully.`);
  }
}