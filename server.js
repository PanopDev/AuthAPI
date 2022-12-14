const express = require('express');
const cookieparser = require('cookie-parser')
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const mongoConnect = require('./config/mongo')
const verifyJWT = require('./middleware/verifyJWT')
require('dotenv').config();

mongoConnect()

app.use(cookieparser());
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/register', require('./routes/register'))
app.use('/login', require ('./routes/login'))
app.get('/', verifyJWT, (req,res)=>{
res.status(200).json({message:'cleared jwt', user:req.user})
})



mongoose.connection.once('open',()=>{

console.log('Connected to Mongo DB')
app.listen(PORT, ()=> console.log(`Listening on port ${ PORT }`));

})



