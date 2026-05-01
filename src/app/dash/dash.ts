import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-dash',
  imports: [CommonModule],
  templateUrl: './dash.html',
  styleUrl: './dash.css',
})
export class Dash {
  private employeeService = inject(EmployeeService);

  // Live date
  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // KPI Computations driven entirely by the global EmployeeService
  totalEmployees = computed(() => this.employeeService.employees().length);
  
  pendingLeaves = computed(() => 
    this.employeeService.employees().filter(e => e.status === 'On Leave').length
  );
  
  presentToday = computed(() => {
    const total = this.totalEmployees();
    return total > 0 ? total - this.pendingLeaves() : 0;
  });

  monthlyPayroll = computed(() => {
    return this.employeeService.employees()
      .filter(e => e.status === 'Active')
      .reduce((sum, e) => sum + (Number(e['salary']) || 0), 0);
  });

  // Dynamic Department Breakdown
  departments = computed(() => {
    const emps = this.employeeService.employees();
    if (emps.length === 0) return [];
    
    const colors: Record<string, string> = {
      'Engineering': '#3b82f6',
      'HR': '#8b5cf6',
      'Finance': '#10b981',
      'Marketing': '#f59e0b',
      'Sales': '#ec4899',
      'Operations': '#ef4444'
    };

    const counts: Record<string, number> = {};
    emps.forEach(e => {
      counts[e.department] = (counts[e.department] || 0) + 1;
    });

    return Object.keys(counts).map(name => ({
      name,
      count: counts[name],
      pct: Math.round((counts[name] / emps.length) * 100),
      color: colors[name] || '#64748b'
    })).sort((a, b) => b.count - a.count);
  });

  // Dynamic Upcoming Birthdays
  birthdays = computed(() => {
    const today = new Date();
    // Reset time for accurate day comparisons
    today.setHours(0, 0, 0, 0);

    const emps = this.employeeService.employees().filter(e => e['dob']);
    
    return emps.map(e => {
      const dob = new Date(e['dob']);
      // Set to this year to check if it has passed
      dob.setFullYear(today.getFullYear());
      
      if (dob < today) {
        dob.setFullYear(today.getFullYear() + 1); // Next year's birthday
      }
      
      const diffTime = dob.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let tag = `In ${diffDays} days`;
      if (diffDays === 0) tag = 'Today!';
      else if (diffDays === 1) tag = 'Tomorrow';

      return {
        name: e.name,
        initials: this.getInitials(e.name),
        date: dob.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        tag: tag,
        daysAway: diffDays,
        avatarBg: this.getRandomColor(e.name)
      };
    })
    .filter(b => b.daysAway <= 14) // Only show if within 2 weeks
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, 3);
  });

  // Dynamic Recent Activities (Hires)
  activities = computed(() => {
    const emps = this.employeeService.employees().filter(e => e['joinDate']);
    
    // Sort by joinDate desc
    const sorted = [...emps].sort((a, b) => new Date(b['joinDate']).getTime() - new Date(a['joinDate']).getTime());
    
    return sorted.slice(0, 4).map(e => ({
      name: e.name,
      desc: `joined as ${e.designation}`,
      time: new Date(e['joinDate']).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: this.getRandomColor(e.name)
    }));
  });

  // Attendance chart bars (Left hardcoded as we don't have historical attendance module yet)
  attendanceBars = [
    { day: 'Mon', present: 85, absent: 15 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 78, absent: 22 },
    { day: 'Thu', present: 95, absent: 5 },
    { day: 'Fri', present: 88, absent: 12 },
    { day: 'Sat', present: 40, absent: 60 },
    { day: 'Sun', present: 20, absent: 80 },
  ];

  private getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  private getRandomColor(name: string): string {
    if (!name) return '#64748b';
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}
