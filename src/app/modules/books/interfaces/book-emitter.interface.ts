import { EmitterType } from '../enums/emitter-type.enum';
import { BookModel } from '../models/book.model';

export interface BookEmitter {
  book: BookModel;
  emitterType: EmitterType;
}
