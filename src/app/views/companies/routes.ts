import { Routes } from '@angular/router';

declare const $localize: any;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./companies.component').then((m) => m.CompaniesComponent),
    data: {
      title: $localize`Companies`,
    },
  },
];
