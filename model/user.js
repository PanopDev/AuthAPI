const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
},
password:{
    type:String,
    required:true
},
email:{
    type:String,
    unique:true,
    lowercase:true
    
},

refreshToken:String,

verified:{
    type: Boolean,
    default:false
    }

})

module.exports = mongoose.model('user', userSchema )