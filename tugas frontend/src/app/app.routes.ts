import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { CustomerComponent } from './pages/customer/customer';
import { Dashboard } from './pages/dashboard/dashboard';
import { ContactsComponent } from './pages/contacts/contacts';
export const routes: Routes = [
    {
        path: '',
        component: Main,
        children: [
            {path: 'customers', component: CustomerComponent},
            {path: 'dashboard', component: Dashboard},
            {path: 'contacts', component: ContactsComponent},
            {path: 'activities', component: CustomerComponent},
            {path: 'users', component: CustomerComponent},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
        
        
    }
];
