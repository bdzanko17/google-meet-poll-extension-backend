const server = require("http").createServer();
const io = require("socket.io")(server);

io.on('connect', socket => {
  socket.on("vote",data=>{
    socket.emit("active_poll",data);
  });

  socket.on("votes",data=>{
    console.log(data);
  });
  
});

server.listen(3000);
