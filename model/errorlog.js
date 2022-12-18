const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const errorLogSchema = new Schema({
username:String,
submitted_Username:String,
email:String,
submitted_Email:String,
route:String,
method:String,
message:String,
stack:String,
timestamp: String,
})

module.exports = mongoose.model('errorLog', errorLogSchema)