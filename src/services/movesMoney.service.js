const { HttpError } = require("../utils/error");

const moveMoney = async (app, sourceId, destinationId, amount, transaction) => {
  const { Profile } = app.get('models');

  const [source, destination] = await Promise.all([
    Profile.findOne({ where: {id: sourceId }, transaction }),
    Profile.findOne({ where: {id: destinationId }, transaction }),
  ]);

  if (!source) {
    throw new HttpError(400, 'Source of money was not found');
  }

  if (amount > source.balance) {
    throw new HttpError(400, 'Client does not have enough balance');
  }

  if (!destination) {
    throw new HttpError(400, 'Destination of money was not found');
  }

  await Promise.all([
    Profile.update(
      { balance: source.balance - amount },
      { where: { id: sourceId }, transaction }
    ), Profile.update(
      { balance: destination.balance + amount },
      { where: { id: destinationId }, transaction }
    )
  ]);
};

module.exports = {
  moveMoney,
};
