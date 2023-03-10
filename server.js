const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const cookieparser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const mongoConnect = require('./config/mongo');
const verifyJWT = require('./middleware/verifyJWT');
const { logError } = require('./controllers/logHandler');
const handleErrors = require('./middleware/handleErrors');
const { socketIO } = require('./controllers/socket');
const throwErr = require('./helpers/throwErr');
require('dotenv').config();

mongoConnect();

app.use(cookieparser());
app.use(express.json());
app.use(cors({origin: ['http://10.0.0.165:3000','http://localhost:3000'],credentials:true}));
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
//reinsert verifyJWT to userroute when done testing
app.use('/user/', require('./routes/userProfile'))
app.use('/findUsers/', require('./routes/findUsers'))
app.use('/conversation', require('./routes/conversation'))
app.use('/logs/', require('./routes/logs'));

// app.get('/', verifyJWT, (req,res)=>{
// res.status(200).json({message:'cleared jwt', user:req.user})
// })
app.use('*', (req,res,next)=>{throwErr('Invalid API Route', 404, next)})
app.use('/', (req,res,next)=>{
  socketIO(server,next,req)
} )


app.use(handleErrors);

mongoose.connection.once('open', () => {
  console.log('Connected to Mongo DB');
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    
  });
});
