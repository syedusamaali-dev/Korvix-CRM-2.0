import { Routes } from '@angular/router';

declare const $localize: any;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./customers.component').then(m => m.CustomersComponent),
    data: {
      title: $localize`Customers`
    }
  }
];

