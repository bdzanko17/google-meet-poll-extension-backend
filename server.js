var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var cors = require("cors");
var code = 12345;
var answers = new Map();
app.use(cors());

io.on("connect", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
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

  socket.on("code", (codee) => {
    if ((code == codee)) socket.emit("organizator", 1);
  });

  socket.on("votes", ({ answer, room }) => {
    answers.get(room)[answer]++;
  });
});

server.listen(process.env.PORT || 3000);
