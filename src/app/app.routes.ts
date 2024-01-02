import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('../app/features/login/login').then((m) => m.Login),
  },

  {
    path: '',
    loadComponent: () => import('../app/layout/layout/layout').then((m) => m.Layout),
  },
];
