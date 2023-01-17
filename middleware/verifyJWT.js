const jwt = require('jsonwebtoken');
const {User} = require('../model/user');
const throwErr = require('../helpers/throwErr')

async function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'No token sent in Authorization Headers' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({
        message:
          'Auth header must be supplied... Authorization:Bearer AccessToken12345 ',
      });
  }

  const token = req.headers.authorization.split(' ')[1];
try{

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return throwErr('Invalid Token', 401, next)
    }
    req.user = decoded.user;
  });

//bonus check for user in DB
const verifyUserInDB = await User.findOne({username:req?.user?.username})
if(!verifyUserInDB){
  req.user = '';
  return throwErr('User not found in database',400,next)
}
next();


}
catch(err){
throwErr(err.message, 400, next)
}  

  
}

module.exports = verifyJWT;
