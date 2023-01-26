const { moveMoney } = require('../../src/services/movesMoney.service');

describe('moveMoney', () => {
  let profileModel;
  let app;
  let transaction;
  let sourceId;
  let destinationId;

  beforeEach(() => {
    profileModel = {
      findOne: jest.fn(),
      update: jest.fn(),
    }; 
    app = {
      get: jest.fn().mockReturnValue({
        Profile: profileModel,
      }),
    };
    transaction = {};
    sourceId = 1;
    destinationId = 2;
  });

  test('should throw an error if the client does not have enough balance', async () => {
    app.get('models').Profile.findOne
      .mockResolvedValueOnce({ balance: 100 })
      .mockResolvedValueOnce({ balance: 50 }); 
    try {
      await moveMoney(app, sourceId, destinationId, 150, transaction);
    } catch (error) {
      expect(error.code).toEqual(400);
      expect(error.message).toEqual('Client does not have enough balance');
    }
  });

  test('should throw an error if the destination of money was not found', async () => {
    app.get('models').Profile.findOne
      .mockResolvedValueOnce({ balance: 100 })
      .mockResolvedValueOnce(null);

    try {
      await moveMoney(app, sourceId, destinationId, 50, transaction);
      fail('should throw an error');
    } catch (error) {
      expect(error.code).toEqual(400);
      expect(error.message).toEqual('Destination of money was not found');
    }
  });

  test('should throw an error if the source of money was not found', async () => {
    app.get('models').Profile.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ balance: 100 });

    try {
      await moveMoney(app, sourceId, destinationId, 50, transaction);
      fail('should throw an error');
    } catch (error) {
      expect(error.code).toEqual(400);
      expect(error.message).toEqual('Source of money was not found');
    }
  });

  test('should throw an error if the source of money was not found', async () => {
    const Profile = app.get('models').Profile;
    Profile.findOne
      .mockResolvedValueOnce({ balance: 150 })
      .mockResolvedValueOnce({ balance: 120 });

    await moveMoney(app, sourceId, destinationId, 50, transaction);

    expect(Profile.update).toHaveBeenNthCalledWith(1, 
      { balance: 100 },
      { where: { id: sourceId }, transaction }
    );
    expect(Profile.update).toHaveBeenNthCalledWith(2,
      { balance: 170 }, 
      { where: { id: destinationId }, transaction }
    );
  });
});