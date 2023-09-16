import { Injectable, inject } from '@angular/core';
import { BookService } from '../service/book.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { booksActions } from './books.feature';
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class BooksEffect {
  #service = inject(BookService);
  #actions = inject(Actions);
  #snackBar = inject(MatSnackBar);

  loadBooks$ = createEffect(() => {
    return this.#actions.pipe(
      ofType(booksActions.enterBooks, booksActions.loadBooks),
      exhaustMap(() =>
        this.#service.getBooks().pipe(
          map(books => {
            this.#showSnackBar('Dados carregados com sucesso');
            return booksActions.loadBooksSuccess({ collections: books });
          }),
          catchError(() => of(booksActions.loadBooksFail()))
        )
      )
    );
  });

  createBook$ = createEffect(() => {
    return this.#actions.pipe(
      ofType(booksActions.createBook),
      concatMap(({ book }) =>
        this.#service.create(book).pipe(
          map(book => {
            this.#showSnackBar('Novo livro cadastrado');
            return booksActions.createBookSuccess({ book });
          }),
          catchError(() => of(booksActions.createBookFail()))
        )
      )
    );
  });

  updateBook$ = createEffect(() => {
    return this.#actions.pipe(
      ofType(booksActions.updateBook),
      concatMap(({ book }) =>
        this.#service.update(book).pipe(
          map(book => {
            this.#showSnackBar('Livro atualizado com sucesso');
            return booksActions.updateBookSuccess({ book });
          }),

          catchError(() => of(booksActions.updateBookFail))
        )
      )
    );
  });

  deleteBook$ = createEffect(() => {
    return this.#actions.pipe(
      ofType(booksActions.deleteBook),
      mergeMap(({ book }) =>
        this.#service.delete(book).pipe(
          map(() => {
            this.#showSnackBar('Livro deletado com sucesso');
            return booksActions.deleteBookSuccess();
          }),
          catchError(() => of(booksActions.updateBookFail()))
        )
      )
    );
  });

  #showSnackBar(message: string) {
    this.#snackBar.open(message, 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
