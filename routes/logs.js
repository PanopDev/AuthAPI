const express = require('express');
const router = express.Router();
const {getErrorLogs, logError} = require('../controllers/logHandler')
router.get('/error', getErrorLogs)
router.post('/error', logError)

module.exports = router