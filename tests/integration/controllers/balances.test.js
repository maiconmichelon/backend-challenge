const request = require('supertest');
const app = require('../../../src/app.js');
const { seed } = require('../../../scripts/seedDb.js');

describe("POST /balances/deposit/:userId", () => {
  beforeAll(async () => {
    await seed();
  });

  test("should deposit to the user id", async() => {
    const res = await request(app).post("/balances/deposit/3").set('profile_id', 1).send({ amount: 10 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      "previousBalance": 1150,
      "newBalance": 1140
    }));
  });
});
