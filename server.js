const server = require("http").createServer();

var io = require("socket.io")(server, {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});
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

server.listen(3000);
