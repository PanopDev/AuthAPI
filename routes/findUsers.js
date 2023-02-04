const express = require('express')
const throwErr = require('../helpers/throwErr')
const router = express.Router()
const mongoose = require('mongoose')
const {UserProfile} = require('../model/allSchemaExports')

router.get('/:username',findUsers )


async function findUsers(req,res,next) {


const search= new RegExp(`^${req.params.username}`,`i`)
const foundUsers = await UserProfile.find({username:{$regex: search }}).select('username')
res.status(200).json({data:foundUsers})

}
module.exports = router