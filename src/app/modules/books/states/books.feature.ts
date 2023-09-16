import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { BookModel } from '../models/book.model';

export const booksActions = createActionGroup({
  source: 'Page Book',
  events: {
    EnterBooks: emptyProps(),
    LoadBooks: emptyProps(),
    LoadBooksSuccess: props<{ collections: ReadonlyArray<BookModel> }>(),
    LoadBooksFail: emptyProps(),
    SelectBook: props<{ book: Readonly<BookModel> }>(),
    ClearSelectedBook: emptyProps(),
    CreateBook: props<{ book: Readonly<BookModel> }>(),
    CreateBookSuccess: props<{ book: Readonly<BookModel> }>(),
    CreateBookFail: emptyProps(),
    UpdateBook: props<{ book: Readonly<BookModel> }>(),
    UpdateBookSuccess: props<{ book: Readonly<BookModel> }>(),
    UpdateBookFail: emptyProps(),
    DeleteBook: props<{ book: Readonly<BookModel> }>(),
    DeleteBookSuccess: emptyProps(),
    DeleteBookFail: emptyProps(),
  },
});

const createBook = (
  colletions: ReadonlyArray<BookModel>,
  book: Readonly<BookModel>
) => {
  return [...colletions, book];
};

const updateBook = (
  collections: ReadonlyArray<BookModel>,
  changes: Readonly<BookModel>
) => {
  return collections.map(book =>
    book.id === changes.id ? Object.assign({}, book, changes) : book
  );
};

const deleteBook = (collections: ReadonlyArray<BookModel>, bookId: number) =>
  collections.filter(book => book.id !== bookId);

interface State {
  collections: ReadonlyArray<BookModel>;
  selectedBookId: number | null;
  isBooksLoading: boolean;
  isSaveLoading: boolean;
}

const initialState: State = {
  collections: [],
  selectedBookId: null,
  isBooksLoading: false,
  isSaveLoading: false,
};

const reducer = createReducer(
  initialState,
  on(
    booksActions.enterBooks,
    booksActions.loadBooks,

    (state): State => ({
      ...state,
      selectedBookId: null,
      isBooksLoading: true,
    })
  ),
  on(
    booksActions.clearSelectedBook,
    (state): State => ({
      ...state,
      selectedBookId: null,
    })
  ),
  on(
    booksActions.loadBooksSuccess,
    (state, { collections }): State => ({
      ...state,
      collections: collections,
      isBooksLoading: false,
    })
  ),
  on(
    booksActions.loadBooksFail,
    (state): State => ({
      ...state,
      isBooksLoading: false,
    })
  ),
  on(
    booksActions.selectBook,
    (state, { book }): State => ({
      ...state,
      selectedBookId: book.id,
    })
  ),
  on(
    booksActions.createBook,
    booksActions.updateBook,
    (state): State => ({
      ...state,
      isSaveLoading: true,
      selectedBookId: null,
    })
  ),
  on(
    booksActions.deleteBook,
    (state, { book }): State => ({
      ...state,
      isBooksLoading: false,
      selectedBookId: book.id,
    })
  ),
  on(
    booksActions.createBookSuccess,
    (state, { book }): State => ({
      ...state,
      collections: createBook(state.collections, book),
      isSaveLoading: false,
    })
  ),
  on(
    booksActions.updateBookSuccess,
    (state, { book }): State => ({
      ...state,
      collections: updateBook(state.collections, book),
      isSaveLoading: false,
    })
  ),
  on(
    booksActions.deleteBookSuccess,
    (state): State => ({
      ...state,
      collections: deleteBook(state.collections, state.selectedBookId ?? 0),
      isBooksLoading: false,
    })
  ),
  on(
    booksActions.createBookFail,
    booksActions.updateBookFail,
    (state): State => ({
      ...state,
      isSaveLoading: false,
    })
  ),
  on(
    booksActions.deleteBookFail,
    (state): State => ({
      ...state,
      isBooksLoading: false,
      selectedBookId: null,
    })
  )
);

export const BooksFeature = createFeature({
  name: 'booksFeature',
  reducer,
  extraSelectors: ({
    selectIsBooksLoading,
    selectIsSaveLoading,
    selectCollections,
    selectSelectedBookId,
  }) => ({
    selectIsBooksLoading: createSelector(
      selectIsBooksLoading,
      isBooksLoading => isBooksLoading
    ),
    selectIsSaveLoading: createSelector(
      selectIsSaveLoading,
      isSaveLoading => isSaveLoading
    ),
    selectCollections: createSelector(
      selectCollections,
      collections => collections
    ),
    selectSelectedBookId: createSelector(
      selectSelectedBookId,
      selected => selected
    ),
    selectActiveBook: createSelector(
      selectCollections,
      selectSelectedBookId,
      (collections, bookId) => {
        return collections.find(book => book.id === bookId) || null;
      }
    ),
    selectTotalSumOfPrices: createSelector(selectCollections, collections =>
      collections.reduce((prev, data) => prev + data.amount * data.quantity, 0)
    ),
  }),
});
