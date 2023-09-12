import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  {
    path: 'books',
    loadChildren: () =>
      import('./modules/books/books.routes').then(r => r.BOOK_ROUTES),
  },
];
