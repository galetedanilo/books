import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { BookModel } from '../../models/book.model';
import { EmitterType } from '../../enums/emitter-type.enum';
import { BookEmitter } from '../../interfaces/book-emitter.interface';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css'],
})
export class BooksListComponent {
  @Input() books!: ReadonlyArray<BookModel> | null;
  @Output() eventEmitter = new EventEmitter<BookEmitter>();

  onEdit(book: BookModel) {
    const data = { book, emitterType: EmitterType.EDIT };
    this.eventEmitter.emit(data);
  }

  onDelete(book: BookModel) {
    const data = { book, emitterType: EmitterType.REMOVE };
    this.eventEmitter.emit(data);
  }
}
