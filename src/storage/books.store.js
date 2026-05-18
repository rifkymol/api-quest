const booksStore = {
  books: [],
  nextBookId: 1
};

function resetBooksStore() {
  booksStore.books = [];
  booksStore.nextBookId = 1;
}

module.exports = {
  booksStore,
  resetBooksStore
};
