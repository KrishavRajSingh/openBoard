const express = require("express"); // returns a function wgich need to be called
const socket = require("socket.io");

const app = express();  // initialised and server ready

app.use(express.static("public"))

let port = process.env.PORT || 5000;
let server = app.listen(port,()=>{
    console.log("listening to port "+port);
})

let io = socket(server);

io.on("connection",(socket)=>{
    console.log("connection was made");
    // Received data
    socket.on("beginPath",(data)=>{
        // data -> data from front end
        // transfer data to all computers after receiving
        io.sockets.emit("beginPath",data);
    })

    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
    })

    socket.on("undoRedo",(data)=>{
        io.sockets.emit("undoRedo",data);
    })
})