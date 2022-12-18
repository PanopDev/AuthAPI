const LogError = require('../model/errorlog')
const timeStamp = require('time-stamp')
const User = require('../model/user')
const Errors = require ('../model/errorlog')


async function getErrorLogs(req,res){
    const errors = await Errors.find()
    if(!errors) return res.status('200').json({message:"No errors found"})
    res.status(200).json(errors)
}

async function logError(req,err){
const refreshCookie = req?.cookies?.refresh || 'No Cookie'
const foundUser = await User.findOne({refreshToken:refreshCookie})
const errorLog = await
    LogError.create({
    username:foundUser?.username,
    submitted_Username: req?.body?.username,
    email:foundUser?.email,
    submitted_Email:req?.body?.email,
    route:req?.path,
    method:req?.method,
    message:err?.message,
    stack:err?.stack,
    timestamp: timeStamp('MM/DD/YYYY @ HH:mm:ss')
    })
    console.log(errorLog)
}

module.exports = {getErrorLogs, logError}