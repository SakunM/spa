class Soc{
  constructor(){
    const http = require("http"), express = require("express"), socketIo = require("socket.io"), fs = require("fs"),
      app = express(), server = http.createServer(app), io = socketIo.listen(server);
    this.web = { http, express, app, server, io, fs, id: 0};
  }
  setWatch(req,res,next){
    if(req.url === "/data.js"){
      console.log("監視を開始するよ");
      this.web.fs.watchFile("data.js",(cur,pre) => {
      if(cur.mtime != pre.mtime){
        console.log("更新したよ！！");
        this.web.io.sockets.emit("script", "data.js")
      }
    });
    }
    next();
  }
  init(){
    const {app, express, server} = this.web;
    app.use((req,res,next) => this.setWatch(req,res,next))
    .use(express.static(__dirname + '/')).get('/',(_,res) => res.redirect("./socket2.html"));
    server.listen(3000); console.log("Express Server start!");
  }

}
if(require.main === module){
  let s = new Soc();
  s.init();
}