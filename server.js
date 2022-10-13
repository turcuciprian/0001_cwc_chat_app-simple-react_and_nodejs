const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection",(socket)=>{
    console.log('A user Connected');
    socket.on("message",(msg)=>{
        console.log(`user: ${msg.user} / message: ${msg.message}`);
        socket.broadcast.emit("message",{user: msg.user, message: msg.message})

    })

})

const port = 3001
server.listen(port, ()=>{
    console.log(` Started Server on port ${port}`);
})