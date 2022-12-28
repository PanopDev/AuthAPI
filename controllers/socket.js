const { Server } = require('socket.io')

function socketIO(server,next,req){

    const io = new Server(server, {
        cors:{
            origin: ['http://localhost:3000','http://10.0.0.165:3000'],
            methods: ["POST","GET"]
        }
    })

    let onlineUsers = []
    io.on('connection', (socket)=>{

        let user = ''
        
        
        socket.on('connectmessage',(data=>{
           
           let user = data?.user || socket.id
            // socket.id = 1234
            onlineUsers = [...onlineUsers,{user:data.user,id:socket.id} ]

            io.emit('newUserJoined',{user:user,id:socket.id, online:onlineUsers})
            console.log('user connected',user, socket.id)
          
        }))


        socket.on('message',(data)=>{
            console.log(data)
            socket.broadcast.emit('incomingMessage',data)
        })


        socket.on("disconnect",(data)=>{
            console.log('user bailed', onlineUsers.filter((user)=>socket.id === user.id))
            onlineUsers = onlineUsers.filter((user)=>socket.id !== user.id)
            io.emit('updateOnline',onlineUsers)
            
        })

        })
 
}

 
    module.exports = { socketIO }