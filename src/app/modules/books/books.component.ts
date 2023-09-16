import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookDetailsComponent } from './ui/book-details/book-details.component';
import { BooksListComponent } from './ui/books-list/books-list.component';
import { BooksTotalComponent } from './ui/books-total/books-total.component';
import { BookEmitter } from './interfaces/book-emitter.interface';

import { BookModel } from './models/book.model';
import { EmitterType } from './enums/emitter-type.enum';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/shared/ui/confirmation/confirmation.component';
import { Store } from '@ngrx/store';
import { BooksFeature, booksActions } from './states/books.feature';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    BookDetailsComponent,
    BooksListComponent,
    BooksTotalComponent,
    ConfirmationComponent,
    MatDialogModule,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  #matDialog = inject(MatDialog);
  #store = inject(Store);

  protected selectedBook$ = this.#store.select(BooksFeature.selectActiveBook);

  protected books$ = this.#store.select(BooksFeature.selectCollections);

  protected totalPrice$ = this.#store.select(
    BooksFeature.selectTotalSumOfPrices
  );

  protected loading$ = this.#store.select(BooksFeature.selectIsSaveLoading);

  ngOnInit(): void {
    this.#store.dispatch(booksActions.enterBooks());
  }

  onEmitter(emitter: BookEmitter) {
    switch (emitter.emitterType) {
      case EmitterType.SAVE:
        this.#saveBook(emitter.book);
        break;

      case EmitterType.EDIT:
        this.#store.dispatch(booksActions.selectBook({ book: emitter.book }));
        break;

      case EmitterType.REMOVE:
        this.#openDialog(emitter.book);
        break;
    }
  }

  onNewBook() {
    this.#store.dispatch(booksActions.clearSelectedBook());
  }

  #saveBook(book: BookModel) {
    const bookFormated = this.#prepareFormatModel(book);

    if (book.id === 0) {
      this.#store.dispatch(booksActions.createBook({ book: bookFormated }));
    } else {
      this.#store.dispatch(booksActions.updateBook({ book: bookFormated }));
    }
  }

  #openDialog(book: Readonly<BookModel>): void {
    const dialogRef = this.#matDialog.open(ConfirmationComponent, {
      data: {
        title: $localize`Remove Book`,
        subtitle: $localize`Do you want to remove the book: ${book.name}`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.#store.dispatch(booksActions.deleteBook({ book }));
      }
    });
  }

  #prepareFormatModel(book: BookModel): BookModel {
    return {
      ...book,
      quantity: +book.quantity,
      amount: +book.amount.toString().replace(',', ''),
    };
  }
}
