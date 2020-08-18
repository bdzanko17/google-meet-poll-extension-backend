const io = require('socket.io').listen(4000).sockets;


var ansvers={"1":0,"2":0,"3":0}

io.on('connect', socket => {
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

