import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BookDetailsComponent } from './ui/book-details/book-details.component';
import { BooksListComponent } from './ui/books-list/books-list.component';
import { BooksTotalComponent } from './ui/books-total/books-total.component';
import { BookEmitter } from './interfaces/book-emitter.interface';
import { BookService } from './service/book.service';
import { BookModel } from './models/book.model';
import { EmitterType } from './enums/emitter-type.enum';
import { finalize } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/shared/ui/confirmation/confirmation.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    BookDetailsComponent,
    BooksListComponent,
    BooksTotalComponent,
    ConfirmationComponent,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  #service = inject(BookService);
  #snackBar = inject(MatSnackBar);
  #matDialog = inject(MatDialog);

  protected currentBook: BookModel | null = null;
  protected books: BookModel[] = [];
  protected total = 0;
  protected loading = false;

  ngOnInit(): void {
    this.#getAllBooks();
  }

  onEmitter(emitter: BookEmitter) {
    switch (emitter.emitterType) {
      case EmitterType.SAVE:
        this.#saveBook(emitter.book);
        break;

      case EmitterType.EDIT:
        this.currentBook = emitter.book;
        break;

      case EmitterType.REMOVE:
        this.#openDialog(emitter.book);
        break;
    }
  }

  onNewBook() {
    this.currentBook = null;
  }

  #saveBook(book: BookModel) {
    this.loading = true;

    const bookModel = this.#prepareFormatModel(book);

    if (book.id === 0) {
      this.#service
        .create(bookModel)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.#showSnackBar($localize`New book registered successfully`);
            this.#getAllBooks();
          },
          error: () =>
            this.#showSnackBar(
              $localize`An error occurred while saving the data`
            ),
        });
    } else {
      this.#service
        .update(bookModel)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.#showSnackBar($localize`Update book registered successfully`);
            this.#getAllBooks();
          },
          error: () =>
            this.#showSnackBar(
              $localize`An error occurred while saving the data`
            ),
        });
    }
  }

  #getAllBooks() {
    this.#service.getBooks().subscribe({
      next: data => {
        this.books = data;
        this.total = this.books.reduce(
          (prev, book) => prev + book.amount * book.quantity,
          0
        );
        this.currentBook = null;
      },
      error: () =>
        this.#showSnackBar($localize`An error occurred while loading the data`),
    });
  }

  #openDialog(book: BookModel): void {
    const dialogRef = this.#matDialog.open(ConfirmationComponent, {
      data: {
        title: $localize`Remove Book`,
        subtitle: $localize`Do you want to remove the book: ${book.name}`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.#service.delete(book).subscribe({
          next: () => {
            this.#showSnackBar($localize`Book removed successfully`);
            this.#getAllBooks();
          },
          error: () =>
            this.#showSnackBar(
              $localize`An error occurred while deleting data`
            ),
        });
      }
    });
  }

  #showSnackBar(message: string) {
    this.#snackBar.open(message, 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
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
