function throwErr(message = '', code = 500, next){
    if(typeof code !== 'number'){
        code = 500
    }
    return next( Error(message,{
      cause:{
        message:message,
        status:code
      }}))
  }
  
module.exports = throwErr