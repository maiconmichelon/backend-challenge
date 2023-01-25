const { Op, Sequelize } = require("sequelize");
const { HttpError } = require("../utils/error");

const getUnpaidJobsByProfileId = async(app, profileId) => {
  const {Job, Contract} = app.get('models');

  return await Job.findAll({
    where: {
      // paid: false, // FIXME
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
      // paid: false, // FIXME
      [Op.or]: {
        "$Contract.ClientId$": profileId,
      },
      "$Contract.status$": { [Op.in]: ['new', 'in_progress'] },
    },
    include: [
      {
        model: Contract,
        include: [{
          association: 'Contractor'
        }, {
          association: 'Client'
        }]
      }
    ],
    ...options
  });
}

const payJob = async (app, profile, jobId) => {
  const sequelize = app.get("sequelize");
  const transaction = await sequelize.transaction();
  const {Job, Profile} = app.get('models');

  try {
    const job = await getUnpaidJobByClientId(app, profile.id, jobId, { transaction });
    if (!job) {
      throw new HttpError(404, 'Job not found');
    }

    const client = job.Contract.Client;
    const contractor = job.Contract.Contractor;
    
    if (job.price > client.balance) {
      throw new HttpError(401, 'Client does not have enough balance');
    }

    await Profile.update(
      { balance: client.balance - job.price }, 
      { where: { id: client.id }, transaction }
    );

    await Profile.update(
      { balance: contractor.balance + job.price }, 
      { where: { id: contractor.id }, transaction }
    );

    await Job.update(
      { paid: true }, 
      { where: { id: job.id }, transaction}
    );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};


module.exports = {
  getUnpaidJobsByProfileId,
  payJob,
};