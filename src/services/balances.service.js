const { HttpError } = require('../utils/error');
const jobsService = require('./jobs.service');
const { moveMoney } = require('./movesMoney.service');

const deposit = async (app, user, receiverId, amount) => {
  const sequelize = app.get("sequelize");
  const transaction = await sequelize.transaction();

  try {
    const amountUnpaidJobs = await jobsService.getSumAmountUnpaidJobsByClientId(app, user.id, { transaction })
    console.log('amount', amount);

    const limit = amountUnpaidJobs * 0.25;
    if (amount > limit) {
      throw new HttpError(400, `User has a total of $${amountUnpaidJobs} unpaid jobs, then the amount is greater than the limit(${limit})`);
    }

    await moveMoney(app, user.id, receiverId, amount, transaction)

    await transaction.commit();
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    throw err;
  }
}

module.exports = {
  deposit
};