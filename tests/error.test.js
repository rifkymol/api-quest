const request = require("supertest");
const app = require("../src/app");

describe("error handling", () => {
  test("returns JSON 404 for unknown routes", async () => {
    const response = await request(app).get("/not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: "Route not found",
        code: "NOT_FOUND"
      }
    });
  });

  test("returns JSON 400 for invalid JSON", async () => {
    const response = await request(app)
      .post("/ping")
      .set("Content-Type", "application/json")
      .send("{bad json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: "Invalid JSON",
        code: "BAD_REQUEST"
      }
    });
  });
});
