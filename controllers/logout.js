/// handle cookies with the same name but different users?
const throwErr = require('../helpers/throwErr');
const User = require('../model/user');

async function handleLogout(req, res) {
  if (!req?.cookies?.refresh) {
    return res.status(200).json({ message: 'No cookie found' });
  }

  const refreshCookie = req?.cookies?.refresh;

  const clearCookie = res.clearCookie('refresh', {
    httpOnly: true,
    secure: true,
  });

  const foundUser = await User.findOne({ refreshToken: refreshCookie }).exec();

  if (!foundUser) {
    clearCookie;
    return res.status(200).json({ message: 'No user found, cookie deleted' });
  }

  console.log('foundUser', foundUser);
  if (foundUser?.refreshToken) {
    foundUser.refreshToken = '';
    foundUser.save();
    clearCookie;
    return res.status(200).json({
      message:
        'Successfully Logged Out',
    });
  }

  clearCookie;
  res.status(200).json({ message: 'Cookie Deleted' });
}

module.exports = handleLogout;
