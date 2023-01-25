const {getProfile} = require('../middleware/getProfile');
const express = require('express');
const balancesService = require('../services/balances.service');
const { HttpError } = require('../utils/error');
const router = express.Router();

router.post('/deposit/:userId', getProfile, async (req, res) =>{
  try {
      const {userId} = req.params;
      await balancesService.deposit(req.app, req.profile, userId, req.body.amount);
      res.json();
    } catch (err) {
      console.error(err);
      if (err instanceof HttpError) { // FIXME try to find a handler
        res.status(err.code).json(err);
      } else {
          res.status(500).json(); // FIXME
      }
    } 
});


module.exports = router;