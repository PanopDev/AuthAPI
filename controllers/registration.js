//save refresh token to DB
//JWT sign and send back refresh-token http only cookie return accessToken in response

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../model/user')

async function registerUser(req,res){

    if (!req.body.username || !req.body.password)
    {return res.status(400).json({message:"username and password required"})};

    if(await User.findOne({email:req?.body?.email}))
    {return res.status(400).json({invalid:"Email already used"})};

    if(await User.findOne({username:req.body.username}))
    {return res.status(400).json({invalid:"Username already used"})};


    try{
        const username = req.body.username
        const password = await bcrypt.hash(req.body.password,10);
        const email = req?.body?.email || ''
        console.log('test2')
         const result = await User.create({
            username,
            password,
            email

         })
        console.log(result)
        res.status(201).json({
        message:"New account Created",
        username,
        email
    })}

    catch(err){
    res.status(400).json(err.message)        
    }


}

module.exports = registerUser