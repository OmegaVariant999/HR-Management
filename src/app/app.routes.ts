import { Routes } from '@angular/router';

import { Dash } from './dash/dash';
import { Employees } from './employees/employees';
import { Payroll } from './payroll/payroll';
import { LeaveManage } from './leave-manage/leave-manage';
import { Attendence } from './attendence/attendence';
import { Profile } from './nav/profile/profile';
import { Settings } from './nav/settings/settings';
import { AddEmployee } from './employees/add-employee/add-employee';
import { LandingPage } from './landing-page/landing-page';
import { Login } from './sign/login/login';
import { SignUp } from './sign/sign-up/sign-up';
import { authGuard } from './auth-guard';
import { NotFound } from './not-found/not-found';
import { ManageUsers } from './manage-users/manage-users';
import { ApplyLeave } from './leave-manage/apply-leave/apply-leave';
import { Features } from './landing-page/features/features';
import { Solutions } from './landing-page/solutions/solutions';
import { Pricing } from './landing-page/pricing/pricing';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'features', component: Features },
    { path: 'solutions', component: Solutions },
    { path: 'pricing', component: Pricing },
    { path: 'login', component: Login },
    { path: 'signup', component: SignUp },
    { path: 'dash', component: Dash, canActivate: [authGuard] },
    { path: 'emp', component: Employees, canActivate: [authGuard] },
    { path: 'add-emp', component: AddEmployee, canActivate: [authGuard] },
    { path: 'pay', component: Payroll, canActivate: [authGuard] },
    { path: 'leavemng', component: LeaveManage, canActivate: [authGuard] },
    { path: 'attn', component: Attendence, canActivate: [authGuard] },
    { path: 'prof', component: Profile, canActivate: [authGuard] },
    { path: 'settings', component: Settings, canActivate: [authGuard] },
    { path: 'manage-users', component: ManageUsers, canActivate: [authGuard] },
    { path: 'apply-leave', component: ApplyLeave, canActivate: [authGuard] },
    { path: '**', component: NotFound }
];
