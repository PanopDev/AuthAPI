const express = require('express')
const router = express.Router()
const {handlePostMessage,handleGetMessages, handleNewConversation} = require('../controllers/conversationController.js')

router.post('/message', handlePostMessage)
router.get('/message', handleGetMessages)
router.post('/', handleNewConversation)

module.exports = router