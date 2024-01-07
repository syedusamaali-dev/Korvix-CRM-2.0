import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./companies.component').then((m) => m.CompaniesComponent),
  },
];
