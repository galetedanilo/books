import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BookModel } from '../models/book.model';

@Injectable()
export class BookService {
  #http = inject(HttpClient);
  #resource = 'http://localhost:3000/books';

  getBooks(): Observable<BookModel[]> {
    return this.#http.get<BookModel[]>(this.#resource);
  }

  create(book: BookModel): Observable<BookModel> {
    return this.#http.post<BookModel>(this.#resource, book);
  }

  update(book: BookModel): Observable<BookModel> {
    return this.#http.put<BookModel>(`${this.#resource}/${book.id}`, book);
  }

  delete(book: BookModel): Observable<void> {
    return this.#http.delete<void>(`${this.#resource}/${book.id}`);
  }
}
