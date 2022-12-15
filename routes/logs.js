const express = require('express');
const router = express.Router();
const {errorLogs, logError} = require('../controllers/logHandler')
router.get('/error', errorLogs)
router.post('/error', logError)

module.exports = router