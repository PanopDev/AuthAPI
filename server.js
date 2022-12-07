const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.get('/',(req,res)=>{

    res.sendStatus(418)

})


app.listen(PORT,()=> console.log(`Listening on port ${PORT}`))


