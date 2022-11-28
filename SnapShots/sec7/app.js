class Server{
  constructor(){
    const express = require("express"), app= express(), url = require("qs"), body = require("body-parser"),
      fs = require("fs"), logger = require("morgan"), auth = require("basic-auth-connect");
    this.config  = { http: require("http"), express, app, logger, auth};
    this.state   = { server: undefined};
    this.helpers = { fs, url, body};
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

  init(){
    const c = this.config, s = this.state, h = this.helpers, {http, app, express, logger, auth} = c, body = h.body;
    s.server = http.createServer(app);
    app.use(express.static("public")).set("veiws", "./views").set("view engine", "pug").use(logger()).use(auth("mamo","spa"))
      .get('/',(_,res) => this.get(res)).use(body.urlencoded({extended: true, limit: "32kb"}))
      .post("/search", (req,res) => this.search(req, res)).get("/data", (_, res) => this.data(res))
      .all("/:type/*?", this.all);
    s.server.listen(3000);
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
