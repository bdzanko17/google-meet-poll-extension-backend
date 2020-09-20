var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var cors = require("cors");
var code = 12345;
var ansvers = { 1: 0, 2: 0, 3: 0 };

app.use(cors());

io.on("connect", (socket) => {

  socket.on("join", (room) => {
    socket.join(room);
    console.log("Connected to room " + room);
  });


  socket.on("vote", ({ room, data,code }) => {
    console.log("SOBA JE " + room + "data is " + data);
    socket.broadcast.to(room).emit("active_poll", data);
    socket.emit("active_poll", data);
    votes = 0;
    ansvers = { 1: 0, 2: 0, 3: 0 };
    setTimeout(() => {
      socket.broadcast.to(room).emit("results", ansvers);
      socket .emit("results", ansvers);
    }, 20000);
  });

  socket.on("code",(codee)=>{
    if(code=codee)
    socket.emit("organizator",1);
  })

  socket.on("votes", ( answer ) => {
    console.log(answer);
    ansvers[answer]++;
  });
});

server.listen(process.env.PORT || 3000);
