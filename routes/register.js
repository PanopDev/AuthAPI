const express = require('express')
const router = express.Router()
const registerUser = require('../controllers/registration')


router.post('/', registerUser)

module.exports = router