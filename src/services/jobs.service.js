const { Op, Sequelize } = require("sequelize");
const { HttpError } = require("../utils/error");
const { moveMoney } = require("./movesMoney.service");

const getUnpaidJobsByProfileId = async(app, profileId) => {
  const {Job, Contract} = app.get('models');

  return await Job.findAll({
    where: {
      paid: false,
      [Op.or]: {
        "$Contract.ClientId$": profileId,
        "$Contract.ContractorId$": profileId,
      },
      "$Contract.status$": { [Op.in]: ['new', 'in_progress'] },
    },
    include: [
      Contract
    ]
  });
};

const getUnpaidJobByClientId = async(app, profileId, jobId, options) => {
  const {Job, Contract} = app.get('models');
  return await Job.findOne({
    where: {
      id: jobId,
      paid: false,
      [Op.or]: {
        "$Contract.ClientId$": profileId,
      },
      "$Contract.status$": { [Op.in]: ['new', 'in_progress'] },
    },
    include: [
      Contract
    ],
    ...options
  });
}

const getSumAmountUnpaidJobsByClientId = async(app, profileId, options) => {
  const {Job, Contract} = app.get('models');
  return await Job.sum('price', {
    where: {
      paid: false,
      [Op.or]: {
        "$Contract.ClientId$": profileId,
      },
      "$Contract.status$": { [Op.in]: ['new', 'in_progress'] },
    },
    include: [
      Contract,
    ],
    ...options
  });
}

const payJob = async (app, profile, jobId) => {
  const sequelize = app.get("sequelize");
  const transaction = await sequelize.transaction();
  const { Job, Profile } = app.get('models');

  try {
    const job = await getUnpaidJobByClientId(app, profile.id, jobId, { transaction });
    if (!job) {
      throw new HttpError(404, 'Job not found or is already paid');
    }

    const contract = job.Contract;
    await moveMoney(app, contract.ClientId, contract.ContractorId, job.price, transaction);

    await Job.update(
      { paid: true, paymentDate: new Date() }, 
      { where: { id: job.id }, transaction}
    );

    await transaction.commit();

    const jobPaid = await Job.findOne({ where: { id: job.id }});
    const updatedProfile = await Profile.findOne({ where: { id: profile.id }});
    return {
      job: jobPaid,
      previousBalance: profile.balance,
      newBalance: updatedProfile.balance
    };
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    throw err;
  }
};


module.exports = {
  getUnpaidJobsByProfileId,
  payJob,
  getSumAmountUnpaidJobsByClientId
};