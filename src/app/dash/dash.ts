import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash',
  imports: [CommonModule],
  templateUrl: './dash.html',
  styleUrl: './dash.css',
})
export class Dash {
  // Live date
  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Attendance chart bars (present %, absent %)
  attendanceBars = [
    { day: 'Mon', present: 85, absent: 15 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 78, absent: 22 },
    { day: 'Thu', present: 95, absent: 5 },
    { day: 'Fri', present: 88, absent: 12 },
    { day: 'Sat', present: 40, absent: 60 },
    { day: 'Sun', present: 20, absent: 80 },
  ];

  // Department breakdown
  departments = [
    { name: 'Engineering',  count: 42, pct: 85, color: '#3b82f6' },
    { name: 'HR',           count: 18, pct: 36, color: '#8b5cf6' },
    { name: 'Finance',      count: 24, pct: 48, color: '#10b981' },
    { name: 'Marketing',    count: 22, pct: 44, color: '#f59e0b' },
    { name: 'Operations',   count: 18, pct: 36, color: '#ef4444' },
  ];

  // Recent activities
  activities = [
    { name: 'Rahul Sharma',  desc: 'requested 3-day leave',   time: '20m ago', color: '#3b82f6' },
    { name: 'John Doe',      desc: 'joined as Eng. Analyst',  time: '2h ago',  color: '#10b981' },
    { name: 'Priya Singh',   desc: 'submitted expense report', time: '4h ago',  color: '#f59e0b' },
    { name: 'Payroll',       desc: 'April cycle processed',   time: 'Yesterday',color: '#8b5cf6' },
  ];

  // Upcoming birthdays
  birthdays = [
    { name: 'Priya Singh',  initials: 'PS', date: '22 May', tag: 'In 3 days',  avatarBg: '#1e3a6e' },
    { name: 'Aman Verma',   initials: 'AV', date: '25 May', tag: 'In 6 days',  avatarBg: '#1e4d3e' },
    { name: 'Sara Kapoor',  initials: 'SK', date: '30 May', tag: 'In 11 days', avatarBg: '#3d1e6e' },
  ];
}
