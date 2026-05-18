const express = require("express");
const { booksStore } = require("../storage/books.store");

const router = express.Router();
const AUTH_TOKEN = "api-quest-token";

function booksAuthGuard(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || token !== AUTH_TOKEN) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  return next();
}

function isValidBookPayload(body) {
  return (
    body &&
    typeof body.title === "string" &&
    body.title.trim() !== "" &&
    typeof body.author === "string" &&
    body.author.trim() !== "" &&
    body.year !== undefined
  );
}

router.post("/", (req, res) => {
  if (!isValidBookPayload(req.body)) {
    return res.status(400).json({
      error: "Invalid book data"
    });
  }

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

router.get("/", booksAuthGuard, (req, res) => {
  let result = [...booksStore.books];
  const { author, page, limit } = req.query;

  if (author !== undefined) {
    result = result.filter((book) => {
      return String(book.author).toLowerCase() === String(author).toLowerCase();
    });
  }

  if (page !== undefined || limit !== undefined) {
    const parsedPage = Number(page || 1);
    const parsedLimit = Number(limit || 10);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1 ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1
    ) {
      return res.status(400).json({
        error: "Invalid pagination parameters"
      });
    }

    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = startIndex + parsedLimit;

    result = result.slice(startIndex, endIndex);
  }

  return res.status(200).json(result);
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
