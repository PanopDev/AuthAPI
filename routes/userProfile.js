const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { UserProfile, User } = require('../model/user');
const throwErr = require('../helpers/throwErr')

router.get('/:username', userController);

async function userController(req, res, next) {
    if (!req.params.username) return throwErr('no user params',400, next)
  const username = req.params.username;
  
  // temporary comment out til everything in place.  
  // if (req.user !== username) throwErr('Unauthorized',401,next)

  try{
    const userProfile = await User.findOne({ username })
    .populate('profiles')
    .select('username profiles');

    if(!userProfile)throwErr(`username ${username} not found in database`, 400, next)

    res.status(200).json({
        username: userProfile.username,
        userId: userProfile._id,
        relationships: userProfile.profiles[0].relationships,
        conversations: userProfile.profiles[0].conversations,
      });

  }
  catch(err){
    throwErr(err.message,400,next)
  }
  


}

module.exports = router;
