const request = require("supertest");
const app = require("../src/app");

describe("POST /echo", () => {
  test("returns 200 and echoes the sent JSON body exactly", async () => {
    const payload = {
      name: "rifky",
      level: 2,
      nested: {
        ok: true
      }
    };

    const response = await request(app)
      .post("/echo")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(payload);
  });

  test("returns an empty object when sent an empty object", async () => {
    const response = await request(app)
      .post("/echo")
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });
});
