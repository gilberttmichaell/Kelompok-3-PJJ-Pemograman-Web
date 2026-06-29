import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';   // ← TAMBAH import ini
import { Dashboard } from './pages/dashboard/dashboard';
import { CustomerComponent } from './pages/customer/customer';
import { Activity } from './pages/activities/activities';
import { Contact } from './pages/contact/contact';
import { Users } from './pages/users/users';
import { Leads } from './pages/leads/leads';
import { Deals } from './pages/deals/deals';
import { LandingComponent } from './pages/landing/landing';
import { Notifications } from './pages/notifications/notifications';
import { Messages } from './pages/messages/messages';

import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [

  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },

  {
    path: 'register',                 // ← TAMBAH blok ini
    component: Register,
    canActivate: [guestGuard]
  },

  {
    path: '',
    component: Main,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'customer', component: CustomerComponent },
      { path: 'activities', component: Activity },
      { path: 'contact', component: Contact },
      { path: 'users', component: Users, canActivate: [adminGuard] },
      { path: 'leads', component: Leads },
      { path: 'deals', component: Deals },
      { path: 'notifications', component: Notifications },
      { path: 'messages', component: Messages }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
