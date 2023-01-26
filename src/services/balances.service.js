const { HttpError } = require('../utils/error');
const jobsService = require('./jobs.service');
const { moveMoney } = require('./movesMoney.service');

const deposit = async (app, user, receiverId, amount) => {
  const sequelize = app.get("sequelize");
  const transaction = await sequelize.transaction();
  const { Profile } = app.get('models');

  try {
    const amountUnpaidJobs = await jobsService.getSumAmountUnpaidJobsByClientId(app, user.id, { transaction });

    const limit = amountUnpaidJobs * 0.25;
    if (amount > limit) {
      throw new HttpError(400, `User has a total of $${amountUnpaidJobs} unpaid jobs, then the amount is greater than the limit(${limit})`);
    }

    await moveMoney(app, user.id, receiverId, amount, transaction)

    await transaction.commit();

    const updatedProfile = await Profile.findOne({ where: { id: user.id }});
    return {
      previousBalance: user.balance,
      newBalance: updatedProfile.balance,
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = {
  deposit
};