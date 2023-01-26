const request = require('supertest');
const app = require('../../../src/app.js');
const { seed } = require('../../../scripts/seedDb.js');

describe("GET /best-profession", () => {
  beforeAll(async () => {
    await seed();
  });

  test("should deposit to the user id", async() => {
    const res = await request(app).get("/admin/best-profession?start=2010-01-01&end=2030-01-01").set('profile_id', 1).send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      "profession": "Programmer",
      "amount": 2683
    }));
  });
});

describe("GET /best-clients", () => {
  beforeAll(async () => {
    await seed();
  });

  test("should return best clients", async() => {
    const res = await request(app).get("/admin/best-clients?start=2010-01-01&end=2030-01-01&limit=4").set('profile_id', 1).send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        "id": 4,
        "fullName": "Ash Kethcum",
        "paid": 2020
      }),
      expect.objectContaining({
          "id": 2,
          "fullName": "Mr Robot",
          "paid": 442
      }),
      expect.objectContaining({
          "id": 1,
          "fullName": "Harry Potter",
          "paid": 442
      }),
      expect.objectContaining({
          "id": 3,
          "fullName": "John Snow",
          "paid": 200
      })
  ]));
  });
});
