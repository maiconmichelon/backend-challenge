const {getProfile} = require('../middleware/getProfile');
const express = require('express');
const adminService = require('../services/admin.service');
const { HttpError } = require('../utils/error');
const router = express.Router();

router.get('/best-profession', getProfile, async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;

  try {
    const bestProfession = await adminService.getBestProfession(req.app, new Date(startDate), new Date(endDate));
    res.json(bestProfession);
  } catch (err) {
    next(err);
  }
});

router.get('/best-clients', getProfile, async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const limit = req.query.limit;

  try {
    const bestClients = await adminService.getBestClients(req.app, startDate, endDate, limit);
    res.json(bestClients);
  } catch (err) {
    next(err);
  }
});

module.exports = router;