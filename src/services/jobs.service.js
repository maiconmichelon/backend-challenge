const { Op } = require("sequelize");

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

module.exports = {
  getUnpaidJobsByProfileId,
};