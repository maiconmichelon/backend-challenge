const {getProfile} = require('../middleware/getProfile');
const express = require('express');
const balancesService = require('../services/balances.service');
const router = express.Router();

router.post('/deposit/:userId', getProfile, async (req, res, next) =>{
  try {
      const {userId} = req.params;
      await balancesService.deposit(req.app, req.profile, userId, req.body.amount);
      res.json();
    } catch (err) {
      next(err);
    } 
});


module.exports = router;