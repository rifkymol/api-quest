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

  test("POST /books without title returns 400", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        author: "George Orwell",
        year: 1949
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid book data"
    });
  });

  test("POST /books without author returns 400", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "1984",
        year: 1949
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid book data"
    });
  });

  test("POST /books without year returns 400", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "1984",
        author: "George Orwell"
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid book data"
    });
  });

  test("GET /books without token returns 401", async () => {
    const response = await request(app).get("/books");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Unauthorized"
    });
  });

  test("GET /books with invalid token returns 401", async () => {
    const response = await request(app)
      .get("/books")
      .set("Authorization", "Bearer wrong-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Unauthorized"
    });
  });

  test("GET /books with token returns a raw array", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Clean Code",
        author: "Robert C. Martin",
        year: 2008
      });

    const response = await request(app)
      .get("/books")
      .set("Authorization", "Bearer api-quest-token");

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

  test("GET /books can still return an empty raw array with token", async () => {
    const response = await request(app)
      .get("/books")
      .set("Authorization", "Bearer api-quest-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("GET /books with token returns created books as a raw array", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Clean Code",
        author: "Robert C. Martin",
        year: 2008
      });

    const response = await request(app)
      .get("/books")
      .set("Authorization", "Bearer api-quest-token");

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

  test("GET /books filters by exact author match case-insensitively", async () => {
    await request(app).post("/books").send({
      title: "1984",
      author: "George Orwell",
      year: 1949
    });
    await request(app).post("/books").send({
      title: "Animal Farm",
      author: "George Orwell",
      year: 1945
    });
    await request(app).post("/books").send({
      title: "Dune",
      author: "Frank Herbert",
      year: 1965
    });

    const response = await request(app)
      .get("/books?author=george%20orwell")
      .set("Authorization", "Bearer api-quest-token");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((book) => book.author === "George Orwell")).toBe(true);
  });

  test("GET /books paginates raw array results", async () => {
    await request(app).post("/books").send({
      title: "1984",
      author: "George Orwell",
      year: 1949
    });
    await request(app).post("/books").send({
      title: "Animal Farm",
      author: "George Orwell",
      year: 1945
    });
    await request(app).post("/books").send({
      title: "Dune",
      author: "Frank Herbert",
      year: 1965
    });

    const pageOne = await request(app)
      .get("/books?page=1&limit=2")
      .set("Authorization", "Bearer api-quest-token");
    const pageTwo = await request(app)
      .get("/books?page=2&limit=2")
      .set("Authorization", "Bearer api-quest-token");

    expect(pageOne.status).toBe(200);
    expect(pageTwo.status).toBe(200);
    expect(Array.isArray(pageOne.body)).toBe(true);
    expect(Array.isArray(pageTwo.body)).toBe(true);
    expect(pageOne.body).toHaveLength(2);
    expect(pageTwo.body).toHaveLength(1);
    expect(pageOne.body).not.toEqual(pageTwo.body);
  });

  test("GET /books combines author filter and pagination", async () => {
    await request(app).post("/books").send({
      title: "1984",
      author: "George Orwell",
      year: 1949
    });
    await request(app).post("/books").send({
      title: "Animal Farm",
      author: "George Orwell",
      year: 1945
    });
    await request(app).post("/books").send({
      title: "Dune",
      author: "Frank Herbert",
      year: 1965
    });

    const response = await request(app)
      .get("/books?author=George%20Orwell&page=1&limit=1")
      .set("Authorization", "Bearer api-quest-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        title: "1984",
        author: "George Orwell",
        year: 1949
      }
    ]);
  });

  test("GET /books returns 400 for invalid pagination", async () => {
    const response = await request(app)
      .get("/books?page=0&limit=2")
      .set("Authorization", "Bearer api-quest-token");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid pagination parameters"
    });
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

  test("PUT /books/:id updates a book and returns the raw updated object", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Dune",
        author: "Frank Herbert",
        year: 1965
      });

    const response = await request(app)
      .put("/books/1")
      .send({
        title: "Dune Updated",
        author: "Frank Herbert",
        year: 1965
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      title: "Dune Updated",
      author: "Frank Herbert",
      year: 1965
    });
  });

  test("GET /books/:id confirms an update persisted", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Dune",
        author: "Frank Herbert",
        year: 1965
      });

    await request(app)
      .put("/books/1")
      .send({
        title: "Dune Updated",
        author: "Frank Herbert",
        year: 1965
      });

    const response = await request(app).get("/books/1");

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Dune Updated");
  });

  test("PUT /books/:id returns raw 404 for missing books", async () => {
    const response = await request(app)
      .put("/books/999")
      .send({
        title: "Dune Updated",
        author: "Frank Herbert",
        year: 1965
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Book not found"
    });
  });

  test("DELETE /books/:id deletes a book with no response body", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Dune",
        author: "Frank Herbert",
        year: 1965
      });

    const response = await request(app).delete("/books/1");

    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  test("GET /books/:id returns 404 after a book is deleted", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Dune",
        author: "Frank Herbert",
        year: 1965
      });

    await request(app).delete("/books/1");

    const response = await request(app).get("/books/1");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Book not found"
    });
  });

  test("DELETE /books/:id returns raw 404 for missing books", async () => {
    const response = await request(app).delete("/books/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Book not found"
    });
  });
});
