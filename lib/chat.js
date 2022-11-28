class Chat{
  constructor(){
    this.socket = require("socket.io");
    this.crud = null;
    this.io = undefined;
    this.onlines = {};
    this.log = true;
  }
  emitUserList(){
    this.crud.list("user", { online: true}, list => this.io.emit("listchange", list));
  }
  userUpdateFire(user, cid, sio){
    sio.user = user; user.cid = cid; this.onlines[user._id] = sio;
    sio.emit("userupdate", user); this.emitUserList();
  }
  signIn(guest, res, sio){
    const cid = guest.cid; delete guest.cid;
    if(res){this.crud.update("user", res._id, {"online": true}, () => this.userUpdateFire(res, cid, sio));} 
    else { guest.online = true; this.crud.create("user", guest, res => this.userUpdateFire(res.list.ops[0], cid, sio));}
  }
  addUser(user, sio){
    this.crud.read("user", user.name, res => this.signIn(user, res, sio));
  }
  addUserTest(){
    const crud = require("./crud")(); crud.connect(); this.crud = crud;
    this.io = {emit: (e,_) => console.log(e)};
    let user = {name:"zore", css:{ background:"#ddd", top: 30, left: 50}};
    let sio = {on: "on", emit: (e,_) => console.log(e), user: undefined};
    this.addUser(user, sio);
    setTimeout(()=> crud.stop(), 4000);
  }
  updateChat(chat, sio){
    if(this.onlines.hasOwnProperty(chat.destID)){ this.onlines[chat.destID].emit("updatechat", chat);}
    else {sio.emit("updatechat", {senderID: chat.senderID, message: chat.destName + " has gone offline."})}
  }
  updateChatTest(id1,id2){
    this.io = {emit: (e,_) => console.log(e)};
    let sio = {on: "on", emit: (e,m) => console.log(e,m), user: undefined};
    let chat = {destID: id1, senderID: 4321, destName: "Wilma"}; this.onlines[id2] = this.io;
    this.updateChat(chat, sio);
  }
  signOut(log, sio){
    let id, name;
    try{ id = sio.user._id;} catch(_) { console.log("catch"); return;}
    id = sio.user._id, name = sio.user.name;
    if(this.log){ console.log(`** user [${name}] ${log} ** `);}
    this.crud.update("user", id, {"online": false}, () => this.emitUserList());
  }
  signOutTest(){
    const crud = require("./crud")(); crud.connect(); this.crud = crud;
    this.io = {emit: (e,_) => console.log(e)};
    let user = {_id: "638455b0f5000607889e263d", name: "zoro"};
    let sio = {user: user};
    this.signOut("closed browser window or tab", sio);
    setTimeout(()=> crud.stop(), 4000);
  }
  updateAvatar(avatar){
    this.crud.update("user", avatar.id, {css: avatar.css}, () => this.emitUserList());
  }
  updateAvatarTest(){
    const crud = require("./crud")(); crud.connect(); this.crud = crud;
    this.io = {emit: (_, u) => console.log(u)};
    let avatar = {id: "62e309cfa8f70e3454d29c2b", css: {top: 30, left:50, background: "#333"}};
    this.updateAvatar(avatar);
    setTimeout(()=> crud.stop(), 4000);
  }
  connect(server, crud){
    this.crud = crud;
    const io = this.socket(server); io.on("connection", sio => {
      console.log("connect");
      sio.on("adduser", user => this.addUser(user, sio));
      sio.on("updatechat", chat => this.updateChat(chat, sio));
      sio.on("leavechat", () => this.signOut("log out", sio));
      sio.on("disconnect", () => this.signOut("closed browser window or tab", sio));
      sio.on("updateavatar", avatar => this.updateAvatar(avatar));
    });
    this.io = io;
  }
  entry(){
    // this.addUserTest(); this.updateChatTest(123, 125); this.signOutTest();
    this.updateAvatarTest();
  }
}
module.exports = function(){ const chat = new Chat(); return chat;}

function chatTest(){
  const chat = new Chat();
  chat.entry(); 
}

if(require.main === module){ chatTest();}