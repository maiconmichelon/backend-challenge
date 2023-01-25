const {getProfile} = require('../middleware/getProfile');
const express = require('express');
const jobsService = require('../services/jobs.service');
const router = express.Router();

router.get('/unpaid', getProfile, async (req, res) =>{
    const jobs = await jobsService.getUnpaidJobsByProfileId(req.app, req.profile.id);
    res.json(jobs)
});

module.exports = router;