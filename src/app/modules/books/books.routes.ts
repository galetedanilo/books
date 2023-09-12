import { Routes } from '@angular/router';
import { BookService } from './service/book.service';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    providers: [BookService],
    loadComponent: () =>
      import('./books.component').then(c => c.BooksComponent),
  },
];
