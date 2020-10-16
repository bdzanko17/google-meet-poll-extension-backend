var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var cors = require("cors");
var answers = new Map();
var codes = new Map();
var active = new Map();
var socket_rooms = new Map();
var active_answers = new Map();

app.use(cors());

io.on("connect", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    socket_rooms.set(socket.id,room);
    if(codes.get(room)==null){
      codes.set(room,room.slice(24,27))
      active.set(room,1);
      console.log("Connected to room " + room);
    }else{
      let x = active.get(room);
      x++
      active.set(room,x)
    }
    if(active_answers.get(room)==null){
      active_answers.set(room,0);
    }
  });
  socket.on("vote", ({ room, data, code }) => {
    
    ansvers = { 1: 0, 2: 0, 3: 0 };
    answers.set(room, ansvers);
    socket.broadcast.to(room).emit("active_poll", data);
    socket.emit("active_poll", data);
    active_answers.set(room,0);
    
  });

  socket.on("code", (codee,room) => {
    if ((codes.get(room) == codee)) socket.emit("organizator", 1);
    else
    socket.emit("organizator",0)
  });

  socket.on("disconnect",function(){
    let room = socket_rooms.get(socket.id);
    let x = active.get(room)
    x--;
    active.set(room,x);
    console.log(active.get(room))
  });

  socket.on("votes", ({ answer, room }) => {
    answers.get(room)[answer]++;
    var x = active_answers.get(room);
    x++;
    active_answers.set(room,x);
  
    if(active_answers.get(room)==active.get(room)){
      socket.broadcast.to(room).emit("results",  answers.get(room));
      socket.emit("results", answers.get(room));
    }
  });
});

server.listen(process.env.PORT || 3000);
