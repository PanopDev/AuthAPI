const { logError } = require("../controllers/logHandler")

function handleErrors(err,req,res,next){
    logError(req,err)
    res.status(err?.cause?.status || 500 ).json({error: err.message})
}


module.exports = handleErrors