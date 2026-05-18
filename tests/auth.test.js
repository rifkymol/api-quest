const request = require("supertest");
const app = require("../src/app");

describe("GET /protected", () => {
  const originalApiToken = process.env.API_TOKEN;

  beforeEach(() => {
    process.env.API_TOKEN = "test-secret";
  });

  afterAll(() => {
    process.env.API_TOKEN = originalApiToken;
  });

  test("allows requests with a valid bearer token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer test-secret");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        authenticated: true
      },
      message: "Authorized"
    });
  });

  test("rejects missing authorization header", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: "Authorization token is required",
        code: "UNAUTHORIZED"
      }
    });
  });

  test("rejects malformed authorization header", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Token test-secret");

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual({
      message: "Authorization token is required",
      code: "UNAUTHORIZED"
    });
  });

  test("rejects empty bearer token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer ");

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe("Authorization token is required");
  });

  test("rejects invalid bearer token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer wrong-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: "Invalid token",
        code: "FORBIDDEN"
      }
    });
  });
});
