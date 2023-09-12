import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, first } from 'rxjs';
import { BookModel } from '../models/book.model';

@Injectable()
export class BookService {
  #http = inject(HttpClient);
  #resource = 'http://localhost:3000/books';

  getBooks(): Observable<BookModel[]> {
    return this.#http.get<BookModel[]>(this.#resource).pipe(first());
  }

  create(book: BookModel): Observable<BookModel> {
    return this.#http.post<BookModel>(this.#resource, book).pipe(first());
  }

  update(book: BookModel): Observable<BookModel> {
    return this.#http
      .put<BookModel>(`${this.#resource}/${book.id}`, book)
      .pipe(first());
  }

  delete(book: BookModel): Observable<void> {
    return this.#http
      .delete<void>(`${this.#resource}/${book.id}`)
      .pipe(first());
  }
}
