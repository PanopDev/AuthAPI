const jwt = require('jsonwebtoken');
const bcryt = require('bcrypt');
const User = require('../model/user');

async function authUser(req, res) {


  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ invalid: 'Username and password required' });
  }

  const username = req?.body?.username;

  const founduser = await User.findOne({ username }).exec();

  if (!founduser) {
    return res.status(401).json({ invalid: 'Invalid Username' });
  }

  const validatePassword = await bcryt.compare(
    req.body.password,
    founduser?.password || ''
  );

  if (!validatePassword) {
    return res.status(401).json({ invalid: 'Invalid Password' });
  }

  req.body.password = ';)'
  const accessToken = jwt.sign(
    {
      user: {
        id:founduser._id,
        username:founduser.username,
        verified:founduser.verified
      }
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '1hr',
    }
  );

  const refreshToken = jwt.sign(
    {
      user: { 
        id:founduser._id,
        username:founduser.username,
        verified:founduser.verified
       }
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '1day',
    }
  );

  founduser.refreshToken = refreshToken
  founduser.save()


  res.cookie('refresh', refreshToken, {
    httpOnly: true,
    sameSite:"none",
    // secure:true,
    expiresIn: 60 * 60 * 1000,
  });

  res.status(200).json({ token: accessToken });
}

module.exports = authUser;
