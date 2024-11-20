import { Routes } from '@angular/router';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },

  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./components/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'user-dashboard',
    loadComponent: () =>
      import('./components/user/user-dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'create-incident',
    loadComponent: () =>
      import('./components/admin/create-incident/create-incident.component').then(
        (m) => m.CreateIncidentComponent,
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'assign-incident/:id',
    loadComponent: () =>
      import('./components/admin/assign-incident/assign-incident.component').then(
        (m) => m.AssignIncidentComponent,
      ),
    canActivate: [AuthGuard],
  },
];
