const { Op, Sequelize } = require("sequelize");

const getBestClients = async (app, startDate, endDate, limit = 2) => {
  const {Job, Contract} = app.get('models');

  const result = await Job.findAll({ 
    where: { 
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate]
      }
    },
    include: [{
      model: Contract,
      include: [{
        association: "Client",
      }]
    }],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('price')), 'totalAmount'],
    ],
    group: "Contract->Client.id",
    order: [['totalAmount', 'DESC']],
    limit,
    raw: true
  });
  return result.map(row => ({
    id: row["Contract.Client.id"],
    fullName: `${row["Contract.Client.firstName"]} ${row["Contract.Client.lastName"]}`,
    paid: row["totalAmount"]
  }));
}

const getBestProfession = async (app, startDate, endDate) => {
  const {Job, Contract} = app.get('models');

  const result = await Job.findAll({ 
    where: { 
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate]
      }
    },
    include: [{
      model: Contract,
      include: [{
        association: "Contractor",
      }]
    }],
    attributes: [
      "Contract->Contractor.profession",
      [Sequelize.fn('sum', Sequelize.col('price')), 'totalAmount'],
    ],
    group: "Contract->Contractor.profession",
    order: [['totalAmount', 'DESC']],
    limit: 1,
    raw: true
  });
  return { profession: result[0].profession, amount: result[0].totalAmount };
}

module.exports = {
  getBestClients,
  getBestProfession,
};