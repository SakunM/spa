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
  getPersons(){ return this.persons;}
  on(name,fun){ this.funs[name] = fun;} makeID(){ return `id_0${this.ser++}`;}

  addUser(user){
    const fun = this.funs.userupdate, data = { name: user.name, _id: this.makeID(), cid: user.cid, css: user.css}; 
    this.persons.push(data); setTimeout(()=>{fun(data);}, 2000);
  }
  listchange(){}
  leaveChat(){
    delete this.funs.listchange; delete this.funs.updatechat;
    if(this.timer){ clearTimeout(this.timer); this.timer = undefined;}
    this.listchange();
  }
  emit(msg, data){
    switch(msg){
      case "adduser": this.addUser(data); break;
      case "leavechat": this.leaveChat(); break;
    }
  }
  webTest(){}
}