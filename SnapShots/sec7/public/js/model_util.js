class Person{
  constructor(cid, id, name, css){ this.cid = cid; this.id = id; this.name = name; this.css = css;}
  isAnon(){ return this.css === undefined} isUser(name) { return name === this.name}
}
class ModelUtil{
  complateLogin(login, user, cid){
    delete cid[login.cid]; user.cid = login.cid; user.id = login._id; user.css = login.css; user.name = login.name;
    cid[login._id] = user;
  }
  setChatee(id, state, chat){
    let now = state.cid[id], old = chat.chatee;
    if(now){ if(old && old.id === now.id){ return false;}} else {now = null;}
    chat.chatee = now; return { now, old};
  }
  updateChat(msg, state, chat){
    const {senderID, message} = msg, user = state.user, chatee = chat.chatee;
    let isSet = false, res, sender, isUser = false;
    if(!chatee) { isSet = true;} else if(senderID !== user.id && senderID !== chatee.id){ isSet = true;}
    if(isSet){ res = this.setChatee(senderID, state, chat);}
    sender = state.cid[senderID]; isUser = sender.id === user.id;
    return { setChatee: isSet, chatee: res, msg: {sender, user: isUser, msg: message}}
  }
  persons(u, cid, db) {
    if(!u.cid || !u.name){ throw "名前とIDは必須だよ!!";}
    let person = new Person(u.cid, u.id, u.name, u.css);
    cid[u.cid] = person; db.insert(person); return person;
  }
  personsTest(){
    let u = { cid: "c0", name: "mamo"}, cid = {}, db = TAFFY();
    let m1 = this.persons(u, cid, db).name, m2 = db({name: "mamo"}).first().name, m3 = cid["c0"].name;
    console.assert(m1 === m2); console.assert(m1 === m3); console.log("persons complete!");
  }
  clearDB(db, cid, user){ cid = {}; db = TAFFY(); if(user) { db.insert(user); cid[user.cid] = user} return db;}

  listChange(mens, state, chat){
    const {chatee, online} = chat, {user, db, cid} = state, new_db = this.clearDB(db, cid, user);
    for(let m of mens){
      if(!m.name) { continue;} if(user && user.id === m._id){ user.css = m.css; continue;}
      let map = { cid: m._id, id: m._id, name: m.name, css: m.css}, candi = this.persons(map, cid, new_db);
      if( chatee && chatee.id === candi.id){ chat.online = true; chat.chatee = candi;}
    }
    new_db.sort("name"); if(chatee && !online){ this.setChatee('', state, chat);} return new_db;
  }
  webTest(){
    // this.personsTest();
  }
}