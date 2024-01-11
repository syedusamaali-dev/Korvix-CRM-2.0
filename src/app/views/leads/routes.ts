import { Routes } from '@angular/router';

declare const $localize: any;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./leads.component').then((m) => m.LeadsComponent),
    data: {
      title: $localize`Dashboard`,
    },
  },
];
