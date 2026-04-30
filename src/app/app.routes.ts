import { Routes } from '@angular/router';

import { Dash } from './dash/dash';
import { Employees } from './employees/employees';
import { Payroll } from './payroll/payroll';
import { LeaveManage } from './leave-manage/leave-manage';
import { Attendence } from './attendence/attendence';
import { Profile } from './nav/profile/profile';
import { Settings } from './nav/settings/settings';
import { AddEmployee } from './employees/add-employee/add-employee';

export const routes: Routes = [
    { path: '', redirectTo: 'dash', pathMatch: 'full' },
    { path: 'dash', component: Dash },
    { path: 'emp', component: Employees },
    { path: 'add-emp', component: AddEmployee },
    { path: 'pay', component: Payroll },
    { path: 'leavemng', component: LeaveManage },
    { path: 'attn', component: Attendence },
    { path: 'prof', component: Profile },
    { path: 'settings', component: Settings }
];
