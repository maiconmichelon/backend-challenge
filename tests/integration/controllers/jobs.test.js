const request = require('supertest');
const app = require('../../../src/app.js');
const { seed } = require('../../../scripts/seedDb.js');

describe("GET /jobs/unpaid", () => {
  beforeAll(async () => {
    await seed();
  });

  test("should show all unpaid jobs", async() => {
    const res = await request(app).get("/jobs/unpaid").set('profile_id', 2).send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        "id": 3,
        "description": "work",
        "price": 202,
        "paid": false,
        "paymentDate": null,
        "ContractId": 3,
      }, {
        "id": 4,
        "description": "work",
        "price": 200,
        "paid": false,
        "paymentDate": null,
        "ContractId": 4,
      })
    ]));
  });
});

describe("POST /jobs/:id/pay", () => {
  beforeAll(async () => {
    await seed();
  });

  test("should pay job with success", async() => {
    const res = await request(app).post("/jobs/2/pay").set('profile_id', 1).send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      "job": expect.objectContaining({
        "id": 2,
        "description": "work",
        "price": 201,
        "paid": true,
        "ContractId": 2
      }),
      "previousBalance": 1150,
      "newBalance": 949
    }));
  });
});
