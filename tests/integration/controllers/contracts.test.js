const request = require('supertest');
const app = require('../../../src/app.js');
const { seed } = require('../../../scripts/seedDb.js');

describe("GET /contracts/:id", () => {
  beforeAll(async () => {
    await seed();
  });

  test("should return a valid contract id", async() => {
    const res = await request(app).get("/contracts/1").set('profile_id', 1).send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
       ClientId: 1,
       ContractorId: 5,
       id: 1,
       status: "terminated",
       terms: "bla bla bla"
     }));
  });

  test("should not find contracts of other profiles", async() => {
    const res = await request(app).get("/contracts/1").set('profile_id', 2).send();

    expect(res.status).toBe(404);
  })
});

describe("GET /contracts", () => {
  beforeAll(async () => {
    await seed();
  });

  test("should return all the user contracts", async() => {
    const res = await request(app).get("/contracts").set('profile_id', 4).send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        "ClientId":4,
        "ContractorId":7,
        "id":7,
        "status":"in_progress",
        "terms":"bla bla bla 7",
      }),
      expect.objectContaining({
         "ClientId":4,
         "ContractorId":6,
         "id":8,
         "status":"in_progress",
         "terms":"bla bla bla",
      }),
      expect.objectContaining({
         "ClientId":4,
         "ContractorId":8,
         "id":9,
         "status":"in_progress",
         "terms":"bla bla bla",
      })
   ]));
  });
});