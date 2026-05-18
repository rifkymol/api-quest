const booksStore = {
  books: [],
  nextBookId: 1,
  publicBooksReadUsed: false
};

function resetBooksStore() {
  booksStore.books = [];
  booksStore.nextBookId = 1;
  booksStore.publicBooksReadUsed = false;
}

module.exports = {
  booksStore,
  resetBooksStore
};
