import { Routes } from '@angular/router';

declare const $localize: any;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    data: {
      title: $localize`Dashboard`,
    },
  },
];
