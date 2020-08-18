var express = require('express');
 var   app = express();
   var   server = require('http').createServer(app);
   var  io = require('socket.io').listen(server);
  var cors = require('cors');
  

var ansvers={"1":0,"2":0,"3":0}

app.use(cors())

io.on('connect', socket => {
  console.log("connected :)");
  socket.on("vote",data=>{
    socket.broadcast.emit("active_poll",data);
    socket.emit("active_poll",data);
    votes=0;
    ansvers={"1":0,"2":0,"3":0};
    setTimeout(() => {
      socket.broadcast.emit("results",ansvers);
      socket.emit("results",ansvers);
    }, 20000);
  });

  socket.on("votes",data=>{
    ansvers[data]++;
  });

});

server.listen(process.env.PORT || 3000);

