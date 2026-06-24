import { Routes } from '@angular/router';

import { CustomerComponent } from './pages/customer/customer';
import { DashboardComponent } from './pages/dashboard/dashboard';

import { Activity } from './pages/activities/activities';
import { Contact } from './pages/contact/contact';
import { Users } from './pages/users/users';

import { Leads } from './pages/leads/leads';
import { Deals } from './pages/deals/deals';

export const routes: Routes = [

  {
    path: '',
    component: DashboardComponent
  },

  {
    path: 'customer',
    component: CustomerComponent
  },

  {
    path: 'activities',
    component: Activity
  },

  {
    path: 'contact',
    component: Contact
  },

  {
    path: 'users',
    component: Users
  },

  {
  path: 'leads',
  component: Leads
  },
  
  {
  path: 'deals',
  component: Deals
  }
];