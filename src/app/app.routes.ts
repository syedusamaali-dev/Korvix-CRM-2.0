import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'customers',
        loadChildren: () => import('./views/customers/routes').then((m) => m.routes)
      },
      {
        path: 'companies',
        loadChildren: () => import('./views/companies/routes').then((m) => m.routes)
      },
      {
        path: 'contacts',
        loadChildren: () => import('./views/contacts/routes').then((m) => m.routes)
      },
      {
        path: 'leads',
        loadChildren: () => import('./views/leads/routes').then((m) => m.routes)
      },
      {
        path: 'deals',
        loadChildren: () => import('./views/deals/routes').then((m) => m.routes)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./views/tasks/routes').then((m) => m.routes)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./views/calendar/routes').then((m) => m.routes)
      },
      {
        path: 'reports',
        loadChildren: () => import('./views/reports/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'login' }
];
