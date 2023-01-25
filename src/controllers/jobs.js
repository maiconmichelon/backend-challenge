const {getProfile} = require('../middleware/getProfile');
const express = require('express');
const jobsService = require('../services/jobs.service');
const { HttpError } = require('../utils/error');
const router = express.Router();

router.get('/unpaid', getProfile, async (req, res) =>{
    const jobs = await jobsService.getUnpaidJobsByProfileId(req.app, req.profile.id);
    res.json(jobs)
});

router.post('/:jobId/pay', getProfile, async(req, res) => {
    try {
        const { jobId } = req.params
        await jobsService.payJob(req.app, req.profile, jobId);
        res.json();
    } catch (err) {
        if (err instanceof HttpError) { // FIXME try to find a handler
            res.status(err.code).json(err);
        } else {
            res.status(500).json(); // FIXME
        }
    }
});

module.exports = router;