const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { UserProfile, User } = require('../model/user');
const throwErr = require('../helpers/throwErr');
const verifyJWT = require('../middleware/verifyJWT');
const { Conversation } = require('../model/allSchemaExports');

router.get('/:username', getUserProfile);
router.get('/:username/chats', getUserChats);
router.get('/:username/chats/:chatId', getChatMessagesById);
router.get('/findUsers')

async function getUserProfile(req, res, next) {
  if (!req.params.username) return throwErr('no user params', 400, next);
  const username = req.params.username;
  // temporary comment out til everything in place.
  // if (req.user !== username) throwErr('Unauthorized',401,next)
  try {
    const userProfile = await User.findOne({ username })
      .populate('profiles')
      .select('username profiles');

    if (!userProfile)
      throwErr(`username ${username} not found in database`, 400, next);

    res.status(200).json({
      username: userProfile.username,
      userId: userProfile._id,
      relationships: userProfile.profiles[0].relationships,
      conversations: userProfile.profiles[0].conversations,
    });
  } catch (err) {
    throwErr(err.message, 400, next);
  }
}

async function getUserChats(req, res, next) {
  const username = req?.params?.username;

  const foundUser = await UserProfile.findOne({ username: username });
  if (!foundUser) {
    return throwErr('no user found', 401, next);
    // return res.sendStatus(401)
  }

  const data = await Conversation.userConversations(foundUser);
  return res.status(200).json({ data: data });
}

async function getChatMessagesById(req, res, next) {
  console.log(req.params);
  const chatId = req?.params?.chatId;
  const data = await Conversation.getMessagesById(chatId);
  console.log(data.messages);
  return res.status(200).json({ data: data });
}

module.exports = router;
