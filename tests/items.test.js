const request = require("supertest");
const app = require("../src/app");
const { resetStore } = require("../src/storage/memory.store");

describe("items API", () => {
  beforeEach(() => {
    resetStore();
  });

  test("lists empty items with pagination metadata", async () => {
    const response = await request(app).get("/items");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      },
      message: "Items retrieved"
    });
  });

  test("creates an item", async () => {
    const response = await request(app)
      .post("/items")
      .send({ name: "Test Item" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Item created");
    expect(response.body.data).toMatchObject({
      id: "1",
      name: "Test Item"
    });
    expect(response.body.data.createdAt).toEqual(expect.any(String));
    expect(response.body.data.updatedAt).toEqual(expect.any(String));
  });

  test("rejects missing item name", async () => {
    const response = await request(app)
      .post("/items")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: "Name is required",
        code: "VALIDATION_ERROR"
      }
    });
  });

  test("rejects empty item name", async () => {
    const response = await request(app)
      .post("/items")
      .send({ name: "   " });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Name is required");
  });

  test("gets an item by ID", async () => {
    await request(app).post("/items").send({ name: "First" });

    const response = await request(app).get("/items/1");

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: "1",
      name: "First"
    });
  });

  test("returns 404 for a missing item", async () => {
    const response = await request(app).get("/items/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: "Item not found",
        code: "NOT_FOUND"
      }
    });
  });

  test("updates an item by ID", async () => {
    await request(app).post("/items").send({ name: "Old" });

    const response = await request(app)
      .put("/items/1")
      .send({ name: "New" });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: "1",
      name: "New"
    });
    expect(response.body.message).toBe("Item updated");
  });

  test("returns 404 when updating a missing item", async () => {
    const response = await request(app)
      .put("/items/999")
      .send({ name: "New" });

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe("Item not found");
  });

  test("rejects invalid update body", async () => {
    await request(app).post("/items").send({ name: "First" });

    const response = await request(app)
      .put("/items/1")
      .send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      message: "Name is required",
      code: "VALIDATION_ERROR"
    });
  });

  test("deletes an item by ID", async () => {
    await request(app).post("/items").send({ name: "Delete Me" });

    const deleteResponse = await request(app).delete("/items/1");
    const getResponse = await request(app).get("/items/1");

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data).toMatchObject({
      id: "1",
      name: "Delete Me"
    });
    expect(deleteResponse.body.message).toBe("Item deleted");
    expect(getResponse.status).toBe(404);
  });

  test("returns 404 when deleting a missing item", async () => {
    const response = await request(app).delete("/items/999");

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe("Item not found");
  });

  test("paginates items", async () => {
    await request(app).post("/items").send({ name: "One" });
    await request(app).post("/items").send({ name: "Two" });
    await request(app).post("/items").send({ name: "Three" });

    const response = await request(app).get("/items?page=2&limit=2");

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].name).toBe("Three");
    expect(response.body.data.pagination).toEqual({
      page: 2,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
      hasNextPage: false,
      hasPreviousPage: true
    });
  });

  test("returns empty array for page beyond total pages", async () => {
    await request(app).post("/items").send({ name: "One" });

    const response = await request(app).get("/items?page=10&limit=10");

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
    expect(response.body.data.pagination.page).toBe(10);
  });

  test("rejects invalid page query", async () => {
    const response = await request(app).get("/items?page=abc&limit=10");

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      message: "Page must be a positive integer",
      code: "VALIDATION_ERROR"
    });
  });

  test("rejects invalid limit query", async () => {
    const response = await request(app).get("/items?page=1&limit=101");

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      message: "Limit must be a positive integer up to 100",
      code: "VALIDATION_ERROR"
    });
  });
});
