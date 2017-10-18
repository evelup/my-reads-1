import BookModel from './model/BookModel';
import * as BooksAPI from './BooksAPI';

const MAX_API_RESULTS = '20';
export const getAllBooks = () =>
  new Promise((resolve) => {
    BooksAPI.getAll().then(response =>
      resolve([].concat(...response).map(book => new BookModel(book))));
  });

export const update = book =>
  new Promise(
    (resolve) => {
      BooksAPI.update(book, book.shelf).then((response) => {
        resolve(book);
      });
    },
    (error) => {
      console.log(error);
    },
  );

export const search = (query, allBooks) =>
  new Promise((resolve) => {
    BooksAPI.search(query, MAX_API_RESULTS).then((results) => {
      if (results.error) {
        resolve({
          books: [],
          query,
          hasError: true,
        });
      } else {
        const books = results.map(book => new BookModel(book));
        books.forEach((book, index) => {
          allBooks.forEach((bookOnTheShelf) => {
            if (book.id === bookOnTheShelf.id) {
              books[index].shelf = bookOnTheShelf.shelf;
            }
          });
        });
        resolve({
          books,
          query,
          hasError: false,
        });
      }
    });
  });
