class Crud{
  constructor(){
    const jsv = require("JSV").JSV, fs = require("fs"), user = fs.readFileSync(__dirname + "/user.json", "utf-8"),
      mongo = require("mongodb"), Client = mongo.MongoClient, url = "mongodb://localhost:27017",
      options = { useUnifiedTopology: true, useNewUrlParser: true, serverSelectionTimeoutMS: 40000};
    this.config =  { validator: jsv.createEnvironment(), schema: { "user": JSON.parse(user)}};
    this.state =   { client: new Client(url, options), makeID: mongo.ObjectID};
    this.helpers = { mode: "CRUD modules is loaded in %s mode."};
  }
  async connect(){ await this.state.client.connect();} stop(){ this.state.client.close();}

  typeChecker(type, fun){
    if(!this.config.schema[type]){ fun({ error: "Object type [" + type + "] is not supported."}); return true;}
    return false;
  }
  schemaChecker(type, user){
    const c = this.config, report = c.validator.validate(user, c.schema[type]);
    return report.errors;
  }
  makeCB(cb, err, suc){
    if(err){ console.log(err); cb({msg: err, list: []});} else{ cb({msg: suc.result, list: suc});}
  }
  getTable(name){ const db = this.state.client.db("spa"); return db.collection(name);}

  async read(type, name, fun){
    if(this.typeChecker(type, fun)){ return;}
    const table = this.getTable(type);
    table.findOne({name}, (err, res) => {if(err){ fun(err);} else { fun(res);}}); 
  }
  async list(type, filter, fun){
    if(this.typeChecker(type, fun)){ return;}
    const table = this.getTable(type);
    table.find(filter).toArray((err, docs) => { if(err){ fun(err);} else {fun(docs);}}); 
  }
  async update(type, id, setter, fun){
    if(this.typeChecker(type, fun)){ return;}
    const table = this.getTable(type), options = { multi: true, upsert: false};
    table.updateOne({ _id: this.state.makeID(id)}, {$set: setter}, options, (err, suc) => this.makeCB(fun, err, suc));
  }
  async delete(type, id, fun){
    if(this.typeChecker(type, fun)){ return;}
    const table = this.getTable(type);
    table.deleteOne({ _id: this.state.makeID(id)}, (err,suc) => this.makeCB(fun, err, suc));
  }
  async create(type, user, fun){
    if(this.typeChecker(type, fun)){ return;} const es = this.schemaChecker(type, user);
    if(es.length !== 0){ fun({ msg: "input document not valid", list: es}); return;}
    const table = this.getTable(type); table.insertOne(user, (err, suc) => this.makeCB(fun, err, suc)); 
  }
}

module.exports = function(){ const c = new Crud(); return c;}

function about_happy() {
  const c = new Crud(); c.connect(); c.read("user", "Happy", u => { console.log(u); c.stop();})
}
function about_list() {
const c = new Crud(); c.connect(); c.list("user", '', res => { console.log(res); c.stop()});
}
function about_Betty(){
  const c = new Crud(); c.connect();
  c.update("user", "6010bb930ec3b327d0d9863e", {online: false}, res => { console.log(res.msg);});
  c.read("user", "Betty", u => { console.log(u); c.stop();})
}
function about_momo(){
  let momo = "60124f9662b35a3a34ff2dab"; const c = new Crud(); c.connect();
  c.delete("user", momo, res => { console.log(res.msg); c.stop();});
}
function momo_create(){
  let momo = { name: "momo", css: { top:20, left: 20, background: "rgb(128,128,128)"}};
  const c = new Crud(); c.connect(); c.create("user", momo, res => { console.log(res.msg);});
  c.list("user", '', res => { console.log(res); c.stop()});

}

function about_delete(){
  ds = ["63805191c44e39214443ba80","63805249579a3433d82b10c7","638057a2579a3433d82b10c8","638138dd56fd072b0021a3ab",
    "6381392056fd072b0021a3ac"];
  const c = new Crud(); c.connect();
  c.delete("user", ds[0], res => {console.log(res.msg);});
  c.stop();
}

function nodeTest(){
  // about_happy(); about_list(); about_Betty(); about_momo(); momo_create(); about_delete();
  about_list();
}

if(require.main === module){nodeTest();}