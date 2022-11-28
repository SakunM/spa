const crud = require("./lib/crud");

class Server{
  constructor(){
    const express = require("express"), app= express(), url = require("qs"),
      fs = require("fs"), logger = require("morgan"), auth = require("basic-auth-connect"),
      crud = require("./lib/crud")(), chat = require("./lib/chat")();
    
    this.config  = { http: require("http"), express, app, logger, auth};
    this.state   = { crud, chat, server: undefined};
    this.helpers = { fs, url};
  }
  get(res){ res.render("spa");}

  all(_, res, next){ console.log("all"); res.contentType("json"); next();}

  search(req, res){
    const asc = req.body.search, msg = `${asc}に関するご質問を承りました。`; 
    res.render("result",{ msg: msg});
  }

  data(res){
    const text = this.helpers.fs.readFileSync("./jsons/spa.json"), json = JSON.parse(text);
    res.json(json); 
  }
  list(crud){ return (req,res) => crud.list(req.params.type, '', list => res.send(list));}

  read(crud){ return (req,res) => crud.read(req.params.type, req.params.name, user => res.send(user));}

  init(){
    const c = this.config, s = this.state, h = this.helpers, {http, app, express, logger, auth} = c, body = h.body;
    s.server = http.createServer(app); s.crud.stop(); s.crud.connect();
    app.use(express.static("public")).set("veiws", "./views").set("view engine", "pug").use(logger()) //.use(auth("mamo","spa"))
      .get('/',(_,res) => this.get(res)).use(express.urlencoded({extended: true, limit: "32kb"})).use(express.json())
      .post("/search", (req,res) => this.search(req, res)).get("/data", (_, res) => this.data(res)).all("/:type/*?", this.all)
      .get("/:type/list", this.list(s.crud)).get("/:type/read/:name", this.read(s.crud));
    s.server.listen(3000); s.chat.connect(s.server, s.crud);
    console.log("Express server listen on port %d in %s mode.", s.server.address().port, app.settings.env);
  }
}


function web() { const s = new Server(); s.init();}

if(require.main === module){web();}

/*
nodemon app.js
localhost:3000
curl http://localhost:3000/search -d {}
*/
