const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const errorLogSchema = new Schema({
username:String,
email:String,
route:String,
method:String,
message:String,
stack:String,
timestamp: String,
})

module.exports = mongoose.model('errorLog', errorLogSchema)