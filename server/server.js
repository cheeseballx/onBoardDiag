const {DB_Reader} = require('./worker');

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


//create the runners
const mediumWorker = new DB_Reader("mediumSpeedRunner","test1h",["oil_temp"],100, 10, (x) => {console.log(x)});
mediumWorker.start();