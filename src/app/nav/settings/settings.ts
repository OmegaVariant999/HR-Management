import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {

  // Active tab
  activeTab = signal<string>('notifications');
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab.set(params['tab']);
      }
    });
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }

  // ── General / Company ──────────────────────────────────
  company = {
    legalName: 'TechFlow Solutions Private Limited',
    cinNumber: 'U72900KA2020PTC135790',
    gstin: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    pfRegistration: 'PY/KRP/1234567/000',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    fiscalYearStart: 'April',
  };

  timezones = ['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai'];
  dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
  currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

  // ── Notifications ──────────────────────────────────────
  notifications = {
    emailLeaveRequests: true,
    emailPayrollProcessed: true,
    emailNewEmployee: false,
    emailAttendanceAlert: true,
    systemLeaveApproval: true,
    systemPayrollReminder: false,
    systemBirthday: true,
    systemAnniversary: false,
  };

  // ── Security ───────────────────────────────────────────
  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  };

  sessionTimeouts = ['15', '30', '60', '120'];
  passwordExpiries = ['30', '60', '90', '180', 'Never'];

  // ── Leave Policy ───────────────────────────────────────
  leavePolicy = {
    annualLeave: 18,
    sickLeave: 12,
    casualLeave: 6,
    maternityLeave: 182,
    paternityLeave: 15,
    carryForward: true,
    maxCarryForward: 10,
    autoApprove: false,
  };

  // ── Payroll ────────────────────────────────────────────
  payroll = {
    payDay: '28',
    pfPercentage: 12,
    esiPercentage: 0.75,
    tdsEnabled: true,
    bonusMonth: 'October',
    paySlipEmailEnabled: true,
  };

  payDays = Array.from({ length: 28 }, (_, i) => String(i + 1));

  // ── Appearance ─────────────────────────────────────────
  appearance = {
    theme: 'dark',
    accentColor: '#2563eb',
    compactMode: false,
    language: 'English',
  };

  languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'];

  // ── Save handlers ──────────────────────────────────────
  savedSection = signal<string>('');

  save(section: string) {
    this.savedSection.set(section);
    setTimeout(() => this.savedSection.set(''), 2500);
  }
}
