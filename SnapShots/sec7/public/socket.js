class Soc{
  constructor(){
    const http = require("http"), express = require("express"), socketIo = require("socket.io"),
      app = express(), server = http.createServer(app), io = socketIo.listen(server);
    this.web = { http, express, app, server, io, id: 0};
  }
  countUP(){ let {io, id} = this.web; console.log(id); io.sockets.send(id); this.web.id++;}
  init(){
    const {app, express, server} = this.web; 
    app.use(express.static(__dirname + '/')).get('/',(_,res) => res.redirect("./socket.html"));
    server.listen(3000); console.log("Express Server start!");

    setInterval(() => this.countUP(), 1000);
  }

}
if(require.main === module){
  let s = new Soc();
  s.init();
}