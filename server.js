var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var cors = require("cors");
var answers = new Map();
var codes = new Map();
app.use(cors());

io.on("connect", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    if(codes.get(room)==null)
    codes.set(room,room.slice(24,27))
    console.log("Connected to room " + room);
  });
  socket.on("vote", ({ room, data, code }) => {
    ansvers = { 1: 0, 2: 0, 3: 0 };
    answers.set(room, ansvers);
    socket.broadcast.to(room).emit("active_poll", data);
    socket.emit("active_poll", data);
    setTimeout(() => {
      socket.broadcast.to(room).emit("results",  answers.get(room));
      socket.emit("results", answers.get(room));
    }, 20000);
  });

  socket.on("code", (codee,room) => {
    if ((codes.get(room) == codee)) socket.emit("organizator", 1);
    else
    socket.emit("organizator",0)
  });

  socket.on("votes", ({ answer, room }) => {
    answers.get(room)[answer]++;
  });
});

server.listen(process.env.PORT || 3000);
