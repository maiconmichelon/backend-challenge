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

module.exports = {
  getContractByIdAndProfileId
};