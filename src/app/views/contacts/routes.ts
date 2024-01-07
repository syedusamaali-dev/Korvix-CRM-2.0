import { Routes } from '@angular/router';

declare const $localize: any;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./contacts.component').then((m) => m.ContactsComponent),
    data: {
      title: $localize`Contacts`,
    },
  },
];
