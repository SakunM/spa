class Person{
  constructor(cid, id, name, css){ this.cid = cid; this.id = id; this.name = name; this.css = css;}
  isAnon(){ return this.css === undefined} isUser(name) { return name === this.name}
}
class ModelUtil{
  constructor(){
    
  }
  persons(u, cid, db) {
    if(!u.cid || !u.name){ throw "名前とIDは必須だよ！！";}
    let person = new Person(u.cid, u.id, u.name, u.css);
    cid[u.cid] = person; db.insert(person); return person;
  }
  personsTest(){
    let u = { cid: "c0", name: "mamo"}, cid = {}, db = TAFFY();
    let m1 = this.persons(u, cid, db).name, m2 = db({name: "mamo"}).first().name, m3 = cid["c0"].name;
    console.assert(m1 === m2); console.assert(m1 === m3); console.log("persons complete!");
  }
  clearDB(db, cid, user){ cid = {}; db = TAFFY(); if(user) { db.insert(user); cid[user.cid] = user} return db;}
  webTest(){
    // this.personsTest();
  }
}