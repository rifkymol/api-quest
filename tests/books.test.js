const request = require("supertest");
const app = require("../src/app");
const { resetBooksStore } = require("../src/storage/books.store");

describe("books API", () => {
  beforeEach(() => {
    resetBooksStore();
  });

  test("POST /books returns 201 and the created book with a numeric id", async () => {
    const payload = {
      title: "Clean Code",
      author: "Robert C. Martin",
      year: 2008
    };

    const response = await request(app)
      .post("/books")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      ...payload
    });
  });

  test("GET /books returns a raw array", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Clean Code",
        author: "Robert C. Martin",
        year: 2008
      });

    const response = await request(app).get("/books");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([
      {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        year: 2008
      }
    ]);
  });

  test("GET /books/:id returns one raw book object", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Clean Code",
        author: "Robert C. Martin",
        year: 2008
      });

    const response = await request(app).get("/books/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      title: "Clean Code",
      author: "Robert C. Martin",
      year: 2008
    });
  });

  test("GET /books/:id returns the expected raw 404 shape for missing books", async () => {
    const response = await request(app).get("/books/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Book not found"
    });
  });
});
