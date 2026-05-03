import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, query, where, onSnapshot, updateDoc, doc, Timestamp, orderBy } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface LeaveRequest {
  id?: string;
  employeeId: string;
  employeeName: string;
  type: 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity Leave' | 'Paternity Leave';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: any;
  fromDate: string;
  toDate: string;
  days: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  leaves = signal<LeaveRequest[]>([]);

  constructor() {
    this.listenToLeaves();
  }

  private listenToLeaves() {
    const leavesCol = collection(this.firestore, 'leaves');
    const q = query(leavesCol, orderBy('appliedAt', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      const leaveData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as LeaveRequest));
      this.leaves.set(leaveData);
    });
  }

  async applyForLeave(request: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt'>) {
    const leavesCol = collection(this.firestore, 'leaves');
    await addDoc(leavesCol, {
      ...request,
      status: 'pending',
      appliedAt: Timestamp.now()
    });
  }

  async updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected') {
    const leaveDoc = doc(this.firestore, 'leaves', leaveId);
    await updateDoc(leaveDoc, { status });
  }

  getLeavesByEmployee(empId: string) {
    return this.leaves().filter(l => l.employeeId === empId);
  }
}
