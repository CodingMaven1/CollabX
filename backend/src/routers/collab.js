const express = require("express")
const router = new express.Router()
const Collab = require('../models/collab')
const collabController = require('../controllers/collab-controller')

router.post('/createcollab', collabController.CreateCollab)

module.exports = router