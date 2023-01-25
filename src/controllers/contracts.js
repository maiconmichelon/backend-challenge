const {getProfile} = require('../middleware/getProfile');
const express = require('express');
const contractsService = require('../services/contracts.service');
const router = express.Router();

router.get('/:id', getProfile, async (req, res) =>{
    const {id} = req.params
    const contract = await contractsService.getContractByIdAndProfileId(req.app, id, req.profile.id);
    if(!contract) return res.status(404).end()
    res.json(contract)
});

router.get('/', getProfile, async (req, res) => {
    const contracts = await contractsService.getActiveContractsByProfileId(req.app, req.profile.id);
    res.json(contracts);
})

module.exports = router;