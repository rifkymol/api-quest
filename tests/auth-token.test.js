const request = require("supertest");
const app = require("../src/app");

describe("POST /auth/token", () => {
  test("returns a token for correct credentials", async () => {
    const response = await request(app)
      .post("/auth/token")
      .send({
        username: "admin",
        password: "password"
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: "api-quest-token"
    });
  });

  test("returns 401 for wrong credentials", async () => {
    const response = await request(app)
      .post("/auth/token")
      .send({
        username: "admin",
        password: "wrong"
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Invalid credentials"
    });
  });
});
