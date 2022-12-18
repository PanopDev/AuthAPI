const jwt = require('jsonwebtoken');
const throwErr = require('../helpers/throwErr');
const User = require('../model/user');
async function handleRefresh(req, res, next) {
  const cookies = req?.cookies;

  if (!cookies?.refresh) {
    return throwErr('No token found in cookies',401,next)
    // return res.status(401).json({ invalid: 'No token found in cookies' });
  }
  const refreshToken = cookies?.refresh || '';

  let foundUser = await User.findOne({ refreshToken: cookies?.refresh }).exec();

  if (!foundUser) {
    return throwErr('No token found in database',401,next)
    // return res.status(401).json({ invalid: 'No token found in database' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
    if (err) {
      return throwErr('Expired or Invalid token',401,next);
      // return res.status(401).json({ invalid: 'Expired or Invalid token' });
    }
    if (decoded.user.username !== foundUser.username) {
     
      return throwErr('found username does not match token username',401,next);
      // return res
      //   .status(401)
      //   .json({ invalid: 'found username does not match token username' });
    }

    foundUser.password = '';
    foundUser.refreshToken = '';

    const accessToken = jwt.sign(
      {
        user: foundUser,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '10min' }
    );

    res.status(200).json({ token: accessToken, foundUser });
  });
}

module.exports = handleRefresh;
