
//some important variables, that needs to be defined even before importing 
const port = 3000;
const corsOrigins = ['http://localhost:8080'];

//load the functions for the server
const funs = require('./functions');

//load socket.io with cors and port
const io = require("socket.io")(port, {
    cors: { origin: corsOrigins }
});

//listen on connection signal and print out connection id for now
io.on("connection", socket => {
    console.log(socket.id);
});

//running some reading and emit (send) it at given interval, half a second for now 
setInterval(() => {
    //last insert needs to have a function what to do with the result
    funs.lastInsert((res) => {
        io.emit("data",res);
    })
},1000);