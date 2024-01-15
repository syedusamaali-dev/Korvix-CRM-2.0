import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tasks.component').then((m) => m.TasksComponent),
  },
];
