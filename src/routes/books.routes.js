const express = require("express");
const { booksStore } = require("../storage/books.store");

const router = express.Router();

router.post("/", (req, res) => {
  const { title, author, year } = req.body;
  const book = {
    id: booksStore.nextBookId,
    title,
    author,
    year
  };

  booksStore.nextBookId += 1;
  booksStore.books.push(book);

  return res.status(201).json(book);
});

router.get("/", (req, res) => {
  return res.status(200).json(booksStore.books);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = booksStore.books.find((storedBook) => storedBook.id === id);

  if (!book) {
    return res.status(404).json({
      error: "Book not found"
    });
  }

  return res.status(200).json(book);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = booksStore.books.findIndex((storedBook) => storedBook.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      error: "Book not found"
    });
  }

  const { title, author, year } = req.body;

  booksStore.books[bookIndex] = {
    ...booksStore.books[bookIndex],
    title,
    author,
    year
  };

  return res.status(200).json(booksStore.books[bookIndex]);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = booksStore.books.findIndex((storedBook) => storedBook.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      error: "Book not found"
    });
  }

  booksStore.books.splice(bookIndex, 1);

  return res.status(204).send();
});

module.exports = router;
