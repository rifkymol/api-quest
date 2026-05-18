const request = require("supertest");
const app = require("../src/app");

describe("GET /ping", () => {
  test("returns pong", async () => {
    const response = await request(app).get("/ping");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        pong: true
      },
      message: "pong"
    });
  });
});
