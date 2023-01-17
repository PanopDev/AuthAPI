const jwt = require('jsonwebtoken');
const bcryt = require('bcrypt');
const { User } = require('../model/user');
const throwErr = require('../helpers/throwErr');

async function authUser(req, res, next) {
  // function errupt(){
  //   return next( Error('Username and password required',{
  //     cause:{
  //       message:'Username and Password required',
  //       status:400
  // }

  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    return throwErr('Username and Password required', 400, next);
    // return res.status(400).json({ invalid: 'Username and password required' });
  }

  const username = req?.body?.username;
  const founduser = await User.findOne({ username }).exec();
  const persistLogin = req?.body?.persist;

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    set expires(expiresIn){ this.maxAge = expiresIn }
  };

  if (persistLogin) {
    cookieOptions.expires = 24 * 60 * 60 * 1000;
  }


  if (!founduser) {
    return throwErr('Invalid Username', 401, next);
  }

  const validatePassword = await bcryt.compare(
    req.body.password,
    founduser?.password || ''
  );

  if (!validatePassword) {
    return throwErr('Invalid Password', 401, next);
  }

  req.body.password = ';)';
  const accessToken = jwt.sign(
    {
      user: {
        id: founduser._id,
        username: founduser.username,
        verified: founduser.verified,
      },
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '10s',
    }
  );

  const refreshToken = jwt.sign(
    {
      user: {
        id: founduser._id,
        username: founduser.username,
        verified: founduser.verified,
      },
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '1day',
    }
  );

  founduser.refreshToken = refreshToken;
  founduser.save();

  res.cookie('refresh', refreshToken, cookieOptions);
  res.status(200).json({ token: accessToken });
}

module.exports = authUser;
