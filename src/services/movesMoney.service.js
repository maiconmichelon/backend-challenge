const moveMoney = async (app, sourceId, destinationId, amount, transaction) => {
  const { Profile } = app.get('models');
  
  const source = await Profile.findOne({ where: {id: sourceId }, transaction });
  const destination = await Profile.findOne({ where: {id: destinationId }, transaction });

  if (amount > source.balance) {
    throw new HttpError(400, 'Client does not have enough balance');
  }

  await Profile.update(
    { balance: source.balance - amount }, 
    { where: { id: sourceId }, transaction }
  );

  await Profile.update(
    { balance: destination.balance + amount }, 
    { where: { id: destinationId }, transaction }
  );
};

module.exports = {
  moveMoney,
};