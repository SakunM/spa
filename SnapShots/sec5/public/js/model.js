class Model{
  constructor(){
    this.config = { anon_id: "a0", event: $.gevent, sio: new Fake(), helper: new ModelUtil()};
    this.state = { anon: null, cid_ser: 0, cid: {}, db: TAFFY(), user: null, ser: 0};
    this.chat = {};
  }
  getDB(){ return this.state.db;} getCID(){ return this.state.cid;}
  makeCID(){ return `c${this.state.ser++}`;} getUser(){ return this.state.user;}
  aboutPebbles(spa){
    let db =this. getDB();
    db().each((p,_) => {console.log(p.name);});
    spa.sep(); let pebbles = db({id: "id_03"}).first(); console.log(pebbles.name);
    spa.sep(); let css = JSON.stringify(pebbles.css); console.log(css);
    spa.sep(); console.log(pebbles.isAnon());
    spa.sep(); let anon = db({ id: "a0"}).first(); console.log(anon.name);
    console.log(anon.isAnon());
    spa.sep(); let cid = this.getCID(); console.log(cid["a0"].name);
    
  }
  complateLogin(login){
    const c = this.config, s = this.state, {event, helper} = c, {user, cid} = s;
    event.publish("spa-login", user);
  }
  login(name){
    const c = this.config, s = this.state, {sio, helper} = c, {cid, db} = s;
    let user = helper.persons({cid: this.makeCID(), css: { top: 25, left: 25, background: "#8f8"}, name: name}, cid, db);
    sio.on("userupdate", user => this.complateLogin(user));
    sio.emit("adduser", { cid: user.cid, css: user.css, name: user.name}); s.user = user; 
  }
  logout(){
    const c = this.config, s = this.state, {sio, helper, event} = c, {db, cid, user} = s;
    sio.emit("leavechat"); db({ cid: user.cid}).remove();
    s.user = s.anon; event.publish("spa-logout", user); return true;
  }
  aboutAlfred(spa){
    let t = $("<div/>"), event = this.config.event;
    event.subscribe(t, "spa-login", (_, user) => console.log("Hello ", user.name));
    event.subscribe(t, "spa-logout", (_, user) => console.log("Goodbye ", user.name));

    let user = this.getUser(); console.log(user.isAnon()); spa.sep();
    let db = this.getDB(); db().each((p,_) => console.log(p.name)); spa.sep();
    this.login("Alfred"); user = this.getUser(); console.log(user.isAnon(), user.id, user.cid); spa.sep()
    setTimeout(()=>{
      db = this.getDB(); db().each((p,_) => console.log(p.name)); spa.sep();
      this.logout(); spa.sep(); db = this.getDB(); db().each((p,_) => console.log(p.name));
      spa.sep(); user = this.getUser(); console.log(user.isAnon()); 
    }, 2500);


  }
  webTest(spa){
    const {sio, helper} = this.config; sio.webTest(); helper.webTest();
    // this.aboutPebbles(spa); this.aboutAlfred(spa);
  }
  init(){
    const c = this.config, s = this.state, {anon_id, helper, sio} = c, {cid, db} = s;
    s.user = s.anon = helper.persons({ cid: anon_id, id: anon_id, name: "anoymus"}, cid, db);
    const ps = sio.getPersons();
    for(let p of ps){
      helper.persons({id: p._id, cid: this.makeCID(), css: p.css, name: p.name}, cid, db);
    } 
  }
}