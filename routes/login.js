const express = require('express');
const router = express.Router();
const authUser = require('../controllers/login');
const handleRefresh = require('../controllers/refresh');

router.post('/',authUser )
router.get('/', handleRefresh)

module.exports = router