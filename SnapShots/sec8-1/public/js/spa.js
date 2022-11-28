
class Spa{
  constructor(q, id){
    const slider = new Slider(id.find(".slider")), model = new Model(), avatar = new Avatar(); 
    this.config = {anchor: { chat: {open: true, close: true}}, interval: 200, slider, model, avatar};
    this.state = { slider: "close", anchor: {}, resize: undefined};
    const acct = id.find("header .acct"), nav = id.find("nav");
    this.jq = {q, spa:id, win:$(window), anchor: q.uriAnchor, event: q.gevent, acct, nav};
  }
  copyAnchor(){ return this.jq.q.extend( true, {}, this.state.anchor);}
  anchorPart(chat){
    const anchor = this.jq.anchor; let revise = this.copyAnchor(); 
    for(let key of Object.keys(chat)){ if (key.includes('_')) { continue;} revise[key] = chat[key];}
    if(anchor.setAnchor(revise) === false) {
      console.error("erro"); anchor.setAnchor(this.state.anchor, null, true); return false;
    }
    return true;
  }
  onHashChange(){
    let previous = this.copyAnchor(), proposed; const anchor = this.jq.anchor, s = this.state; 
    try{proposed = anchor.makeAnchorMap();}
    catch(e){ console.error(e); anchor.setAnchor(previous, null, true); return false;}
    s.anchor = proposed; const slider = this.config.slider; let is_ok = true;
    if(!previous || previous.chat !== proposed.chat){
      switch (proposed.chat) {
        case "open": is_ok = slider.setPosition("open"); break;
        case "close": is_ok = slider.setPosition("close"); break;
        default: slider.setPosition("hidden"); delete proposed.chat; anchor.setAnchor(proposed, null, true);
      }
    }
    if(!is_ok){
      if(previous){ anchor.setAnchor(previous, null, true); s.anchor = previous;}
      else{ delete proposed.chat; anchor.setAnchor(proposed, null, true);}
    }
    return false;
  }
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
  zz_act(act,exp,succ, fail){ if(act !== exp) {console.log(fail);} else {console.log(succ);}}
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
    const c = this.config, s = this.state, {spa, anchor, win, event, acct, nav} = this.jq, {slider, model, avatar} = c;
    anchor.configModule({schema_map: c.anchor});
    slider.init(pos => this.anchorPart({chat: pos})); model.init(); avatar.init(nav);

    win.bind("resize", () => this.onResize()).bind("hashchange", e => this.onHashChange()).trigger("hashchange");
    event.subscribe(spa, "spa-login", (_,user) => this.login(user));
    event.subscribe(spa, "spa-logout", () => this.logout());
    acct.text("please sign-in").bind("utap", () => this.onTapAcct());
    
    this.webTest(); slider.webTest(this), model.webTest(this); avatar.webTest(this);
  }
}


function ready(){ const s = new Spa($, $("#spa")); s.init();}
function nodeTest(){ console.log("nodeTest");}
if(typeof window === "undefined"){ nodeTest();} else { jQuery(ready);}

/*
node public/js/spa.js
*/