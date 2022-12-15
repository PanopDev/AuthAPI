
function errorLogs(req,res){
    console.log('ERROR LOGS ARE HERE')
    res.status('200').json({ErrorLogs:"ERROR in life"})
}

function logError(req,res){
    console.log('LOG THE NEW ERRORS HERE')
    res.sendStatus('200')
}

module.exports = {errorLogs, logError}