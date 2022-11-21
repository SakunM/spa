
class Spa{
  constructor(q, id){
    const slider = new Slider(id.find(".slider")), model = new Model(); 
    this.config = {anchor: { chat: {opened: true, closed: true}}, resize: 200, slider, model};
    this.state = {anchor: {}, resize: undefined};
    this.jq = {q, spa:id, anchor: q.uriAnchor, event: q.gevent, win: q(window), acct: id.find(".head > .acct")};
  }
  copyAnchor(){ return this.jq.q.extend(true, {}, this.state.anchor);}

  changeAnchor(chat){
    const revise = this.copyAnchor(), anchor = this.jq.anchor; let ret_val = true;
    for(let key in chat){ revise[key] = chat[key];}
    try{anchor.setAnchor(revise);} catch(e){ anchor.setAnchor(this.state.anchor, null, true); ret_val = false;}
    return ret_val;
  }
  onHashChange(){
    const previous = this.copyAnchor(), s = this.state, anchor = this.jq.anchor; let proposed;
    try{proposed = anchor.makeAnchorMap();} catch(e){anchor.setAnchor(previous, null, true); return false;}
    s.anchor = proposed; const slider = this.config.slider; let is_ok = true;
    if(!previous || previous.chat !== proposed.chat){
      switch (proposed.chat) {
        case "opened": is_ok = slider.setSlider("opened"); break;
        case "closed": is_ok = slider.setSlider("closed"); break;
        default: slider.setSlider("hidden"); delete proposed.chat; anchor.setAnchor(proposed, null, true);
      }
    }
    if(is_ok) { return false;}
    if(previous){ anchor.setAnchor(previous, null, true); s.anchor = previous;}
    else{ delete proposed.chat; anchor.setAnchor(proposed, null, true);}
    return false;
  }
  setAnchor(pos){ return this.changeAnchor({chat: pos});}

  onResize(){
    const s = this.state, c = this.config, slider = c.slider;
    if(s.resize) { return true;}
    slider.handleResize();
    s.resize = setTimeout(()=>{s.resize = undefined;}, c.resize);
    return true;
  }
  onTapAcct(){
    const c = this.config, s = this.state, j = this.jq, model = c.model, user = model.getUser(), acct = j.acct;
    if(user.isAnon()) { let name = prompt("Please sign-in"); model.login(name); acct.text("... prosessing ...");}
    else { model.logout();} return false;
  }
  login(user){ this.jq.acct.text(user.name);} logout(){ this.jq.acct.text("Please sign-in");}
  show(val){ console.log(val);} sep(){ console.log("------------------");} showsep(val){ this.show(val); this.sep();}
  gevetTest(){
    const {q, event} = this.jq; 
    q("body").append('<div id="chat-list"/>'); let box = q("#chat-list");
    box.css({ position: 'absolute','z-index': 3, top: 100, left: 30, width: 150, height: 50, 
      border: '2px solid black', background: "#fff"});
    let onListChange = (e,map) => { box.html(map.text); alert("onListChange run");};
    event.subscribe(box, "spa-listchange", onListChange);
    event.publish("spa-listchange", [{text: "the list is here"}]);
    // box.remove(); event.publish("spa-listchange", [{}]);
  }
  webTest(){
    // this.gevetTest();
  }
  init(){
    const c = this.config, s = this.state, {spa, anchor, win, event, acct} = this.jq, {slider, model} = c;
    anchor.configModule({schema_map: c.anchor});
    slider.init({chat_anchor: pos => {this.setAnchor(pos);}}); model.init();

    win.bind("resize", () => this.onResize()).bind("hashchange", e => this.onHashChange()).trigger("hashchange");
    event.subscribe(spa, "spa-login", (_,user) => this.login(user));
    event.subscribe(spa, "spa-logout", () => this.logout());
    acct.text("please sign-in").bind("utap", () => this.onTapAcct());
    
    this.webTest(); slider.webTest(this), model.webTest(this); 
  }
}


function ready(){ const s = new Spa($, $("#spa")); s.init();}
function nodeTest(){ console.log("nodeTest");}
if(typeof window === "undefined"){ nodeTest();} else { jQuery(ready);}

/*
node public/js/spa.js
*/