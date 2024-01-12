import { Routes } from '@angular/router';

declare const $localize: any;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./deals.component').then((m) => m.DealsComponent),
    data: {
      title: $localize`Dashboard`,
    },
  },
];
