const { Op } = require("sequelize");

getContractByIdAndProfileId = async (app, id, profileId) => {
  const {Contract} = app.get('models')

  return await Contract.findOne({where: {
    id,
    [Op.or]: {
      ContractorId: profileId,
      ClientId: profileId,
    }
  }});
};

getActiveContractsByProfileId = async (app, profileId) => {
  const {Contract} = app.get('models')

  return await Contract.findAll({where: {
    status: { [Op.in]: ['new', 'in_progress'] },
    [Op.or]: {
      ContractorId: profileId,
      ClientId: profileId,
    }
  }});
}

module.exports = {
  getContractByIdAndProfileId,
  getActiveContractsByProfileId
};