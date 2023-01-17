//save refresh token to DB
//JWT sign and send back refresh-token http only cookie return accessToken in response

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {
  userRelationshipsSchema,
  userConversationsSchema,
  User,
  UserProfile,
} = require('../model/user');
// const { conversation, messageSchema } = require('../model/message');
const throwErr = require('../helpers/throwErr');

async function registerUser(req, res, next) {
  if (!req.body.username || !req.body.password || !req.body.email) {
    return throwErr('Username, Email & Password required', 400, next);
  }

  if (await User.findOne({ email: req?.body?.email })) {
    return throwErr('Email already used', 400, next);
  }

  if (await User.findOne({ username: req.body.username })) {
    return throwErr('Username already taken', 400, next);
  }

  try {
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);
    const email = req?.body?.email;

    await User.create({
      username,
      password,
      email,
    });

    await UserProfile.create({
      username,
      relationships: userRelationshipsSchema,
      conversations: userConversationsSchema,
    });

    const userProfile = await UserProfile.findOne({ username: username });
    const user = await User.findOne({ username: username });
    user.profiles = userProfile._id;
    await user.save();

    //populate syntax ref
    // const myTest = await User.findOne({username:username}).populate("profiles")

    res.status(201).json({
      message: 'New account Created',
      username,
      email,
    });
  } catch (err) {
    // res.status(400).json(err.message)
    throwErr(err.message, 400, next);
  }
}

module.exports = registerUser;
