class Fake{
  constructor(){
    this.persons = [
      { name:"Betty",  _id: "id_01", css: {top: 20,  left: 20, background: "rgba(128,128,128)"}},
      { name:"Mike",   _id: "id_02", css: {top: 60,  left: 20, background: "rgba(128,255,128)"}},
      { name:"Pebles", _id: "id_03", css: {top: 100, left: 20, background: "rgba(192,128,192)"}},
      { name:"Wilma",  _id: "id_04", css: {top: 140, left: 20, background: "rgba(192,128,128)"}}
    ];
    this.funs = {}; this.ser = 5; this.timer = undefined;
  }
  on(name,fun){ this.funs[name] = fun;} makeID(){ return `id_0${this.ser++}`;}

  addUser(user){
    const fun = this.funs.userupdate, data = { name: user.name, _id: this.makeID(), cid: user.cid, css: user.css}; 
    this.persons.push(data); setTimeout(()=>{fun(data);}, 2000);
  }
  getUser(id){ return this.persons.find(user => user._id === id);}

  willma(){
    if(this.funs.updatechat){
      let user = this.getUser("id_05"), msg = `Hi there ${user.name}! Whilma here.`,
        msgs = { destID: user._id, destName: user.name, senderID: "id_04", message: msg};
      this.funs.updatechat(msgs);
    }
  }
  fakeMsg(){ setTimeout(()=>{this.willma();}, 3000);}
  
  listchange(){
    this.timer = setTimeout(()=>{
      if(this.funs.listchange) { this.funs.listchange(this.persons); this.fakeMsg(); this.timer = undefined;}
      else { this.listchange();}
    }, 1000);
  }
  respons(msg){
    const user = this.getUser(msg.senderID), res_msg = `Thanks for the note ${user.name}.`,
      res = { destID: user._id, destName: user.name, senderID: msg.destID, message: res_msg};
    this.funs.updatechat(res);
  }
  updateChat(msgs){ setTimeout(()=> this.respons(msgs), 2000);}
  
  updateAvatar(avatar){
    for(let p of this.persons){ if(p._id === avatar.id) { p.css = avatar.css; break;}}
    this.funs.listchange(this.persons);
  }
  leaveChat(){
    delete this.funs.listchange; delete this.funs.updatechat;
    if(this.timer){ clearTimeout(this.timer); this.timer = undefined;}
    // this.listchange();
  }
  emit(msg, data){
    switch(msg){
      case "adduser": this.addUser(data); this.listchange(); break;
      case "updatechat": this.updateChat(data); break;
      case "updateavatar": this.updateAvatar(data); break;
      case "leavechat": this.leaveChat(); break;
    }
  }
  webTest(){
    // console.log(this.getUser("id_03"));;
  }
}