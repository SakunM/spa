class Model{
  constructor(){
    const debug = new Fake();
    // const product = new Data(); 
    let sio; try{sio = new Data();} catch(_) { sio = new Fake();}
    this.config = { anon_id: "a0", event: $.gevent, sio, helper: new ModelUtil(this)};
    this.state = { anon: null, cid_ser: 0, cid: {}, db: TAFFY(), user: null, ser: 0};
    this.chat = { connect: null, online: null, chatee: null};
  }
  getDB(){ return this.state.db;} getCID(cid){ return this.state.cid[cid];} 
  getUser(){ return this.state.user;}  makeCID(){ return `c${this.state.ser++}`;}
  aboutPebbles(spa){
    this.login("mamo");
    setTimeout(()=>{
      let db =this. getDB();
      db().each((p,_) => {console.log(p.name);});
      spa.sep(); let pebbles = db({id: "id_03"}).first(); console.log(pebbles.name);
      spa.sep(); let css = JSON.stringify(pebbles.css); console.log(css);
      spa.sep(); console.log(pebbles.isAnon());
      this.logout();
      setTimeout(()=>{
        spa.sep();
        let anon = this.state.anon;
        console.log(anon.isAnon());
      }, 500);
    }, 3000);    
  }
  complateLogin(login){
    const c = this.config, s = this.state, {event, helper} = c, {user, cid} = s;
    helper.complateLogin(login, user, cid);
    this.join();
    event.publish("spa-login", [user, msg => this.sendMessage(msg), id => this.setChatee(id)]);
  }
  login(name){
    const c = this.config, s = this.state, {sio, helper} = c, {cid, db} = s;
    let user = helper.persons({cid: this.makeCID(), css: { top: 25, left: 25, background: "#8f8"}, name: name}, cid, db);
    sio.on("userupdate", user => this.complateLogin(user));
    sio.emit("adduser", { cid: user.cid, css: user.css, name: user.name}); s.user = user; 
  }
  logout(){
    const c = this.config, s = this.state, {sio, helper, event} = c, {db, cid, user} = s;
    sio.emit("leavechat"); s.db = helper.clearDB(db, cid, user);
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
  listChange(list){
    const c = this.config, s = this.state, {helper, event} = c; s.db = helper.listChange(list, s, this.chat);
    event.publish("spa-listchange", [s, this.chat]);
  }
  join(){
    const c = this.config, s = this.state, connect = this.chat.connect, sio = c.sio, user = s.user;
    if(connect){ return false;} if(user.isAnon()){ console.warn("参加するならログインしてね"); return false;}
    sio.on("listchange", list => this.listChange(list)); sio.on("updatechat", msg => this.updateChat(msg));
    this.chat.connect = true; return true;
  }
  aboutFred(spa){
    let t = $("<div/>"), event = this.config.event;
    event.subscribe(t, "spa-login", (_, user) => console.log("Hello ", user.name));
    event.subscribe(t, "spa-listchange", () => console.log("listchange"));
    let user = this.getUser(); console.log(user.isAnon()); spa.sep();
    this.join(); spa.sep(); this.login("Fred"); 
    setTimeout(()=>{
      let db = this.getDB(); db().each((p,_) => console.log(p.name));
      spa.sep(); this.join();
      setTimeout(()=>{
        spa.sep();
        db = this.getDB(); db().each((p,_) => console.log(p.name));
      }, 1000);
    }, 2500);
  }
  updateChat(msg){
    const c = this.config, s = this.state, {helper, event} = c, res = helper.updateChat(msg, s, this.chat);
    if(res.setChatee){ event.publish("spa-setchatee", res.chatee);}
    event.publish("spa-updatechat", res.msg);
  }
  sendMessage(msg){
    const user = this.state.user, sio = this.config.sio, chatee = this.chat.chatee;
    if(!sio || !(chatee && user)) { return false;}
    let map = { destID: chatee.id, destName: chatee.name, senderID: user.id, message: msg};
    this.updateChat(map); sio.emit("updatechat", map); return true;
  }
  setChatee(id){
    const c = this.config, s = this.state, pair = c.helper.setChatee(id, s, this.chat);
    c.event.publish("spa-setchatee", pair);
  }
  aboutFanny(spa){
    let t = $("<div/>"), event = this.config.event;
    event.subscribe(t, "spa-logon", (_, user) => console.log("Hello ", user.name));
    event.subscribe(t, "spa-updatechat", (_, msg) => console.log("msg : ", msg.msg));
    event.subscribe(t, "spa-setchatee", (_, pair) => console.log("chatee now : ", pair.now.name));
    event.subscribe(t, "spa-listchange", (_, pair) => console.log("List Change"));
    this.login("Fanny");
    setTimeout(()=>{
      console.log("相手を設定しないでメッセージを送信すると　", this.sendMessage("Hi Pebles")); spa.sep();
      setTimeout(()=>{
        spa.sep(); this.sendMessage("what is up, tricks?");
        setTimeout(()=>{
          spa.sep(); this.setChatee("id_03"); this.sendMessage("Hi Prbles!");
        }, 2000);
      }, 3000);
    }, 3000);
  }
  updateAvatar(avatar){ this.config.sio.emit("updateavatar", avatar);}

  aboutJessy(spa){
    let t = $("<div/>"), event = this.config.event;
    event.subscribe(t, "spa-login", (_,user) => console.log("Hello ", user.name));
    event.subscribe(t, "spa-listchange", () => console.log("List Change"));
    this.login("Jessy");
    setTimeout(()=>{
      spa.sep(); let pebles = this.getCID("id_03");
      console.log(JSON.stringify(pebles.css)); spa.sep();
      this.updateAvatar({id: "id_03", css: {}});
      setTimeout(()=>{
        pebles = this.getCID("id_03");
        console.log(pebles.name, JSON.stringify(pebles.css)); spa.sep();
      }, 500);
    }, 3000);
  }
  webTest(spa){
    const {sio, helper} = this.config; sio.webTest(); helper.webTest();
    // this.aboutPebbles(spa); this.aboutAlfred(spa); this.aboutFred(spa); this.aboutFanny(spa); this.aboutJessy(spa);
  }
  init(){
    const c = this.config, s = this.state, {anon_id, helper} = c, {cid, db} = s;
    s.user = s.anon = helper.persons({ cid: anon_id, id: anon_id, name: "anoymus"}, cid, db);
    this.chat.avatar = avatar => this.updateAvatar(avatar);
  }
}