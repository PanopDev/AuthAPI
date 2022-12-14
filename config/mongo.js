mongoose = require('mongoose')

function mongoConnect(){
    const options = {
        useUnifiedTopology:true,
        useNewUrlParser: true}

    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_URI,options)

}

module.exports = mongoConnect