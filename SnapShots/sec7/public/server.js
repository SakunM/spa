class Soc{
  constructor(){
    const http = require("http"), express = require("express"), socketIo = require("socket.io"),
      app = express(), server = http.createServer(app), io = socketIo.listen(server);
    this.web = { http, express, app, server, io};
  }
  init(){
    const {app, express,server, io} = this.web;
    app.use(express.static(__dirname + '/'));
    server.listen(3000); console.log("Express Server start!");

    io.sockets.on("connection", soc => {
      soc.emit("greeting", {message: "hello"}, data => {
        console.log("result: " + data);
      });
    });
  }
}

if(require.main === module){
  let s = new Soc();
  s.init();
}