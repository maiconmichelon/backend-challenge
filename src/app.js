const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./models');
const contracts = require('./controllers/contracts');
const balances = require('./controllers/balances');
const admin = require('./controllers/admin');
const jobs = require('./controllers/jobs');
const { errorHandler } = require('./middleware/errorHandler');
const app = express();

app.use(bodyParser.json());

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use('/contracts', contracts);
app.use('/jobs', jobs);
app.use('/balances', balances);
app.use('/admin', admin);

app.use(errorHandler);

module.exports = app;
