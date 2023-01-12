const app = require('express')
const router = express.Router()
const {handlePostMessage,handleGetMessages} = require('../controllers/messageController.js')

router.post('/', handlePostMessage)
router.get('/', handleGetMessages)

