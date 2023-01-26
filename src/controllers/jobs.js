const {getProfile} = require('../middleware/getProfile');
const express = require('express');
const jobsService = require('../services/jobs.service');
const router = express.Router();

router.get('/unpaid', getProfile, async (req, res) =>{
    const jobs = await jobsService.getUnpaidJobsByProfileId(req.app, req.profile.id);
    res.json(jobs)
});

router.post('/:jobId/pay', getProfile, async(req, res, next) => {
    try {
        const { jobId } = req.params
        const result = await jobsService.payJob(req.app, req.profile, jobId);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;