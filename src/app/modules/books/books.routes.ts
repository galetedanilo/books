import { Routes } from '@angular/router';
import { BookService } from './service/book.service';
import { provideState } from '@ngrx/store';
import { BooksFeature } from './states/books.feature';
import { provideEffects } from '@ngrx/effects';
import { BooksEffect } from './states/books.effects';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    providers: [
      BookService,
      MatSnackBarModule,
      provideState(BooksFeature),
      provideEffects(BooksEffect),
      importProvidersFrom(MatSnackBarModule),
    ],
    loadComponent: () =>
      import('./books.component').then(c => c.BooksComponent),
  },
];
