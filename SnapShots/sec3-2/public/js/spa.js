class Spa{
  constructor(q, id){
    const extend = { time: 2000, height: 450, title: "押すと縮むよ"},
          retract = { time: 300, height: 16, title: "押すと伸びるよ"};
    this.config = {extend: extend, retract: retract, anchor: { chat: {open: true, close: true}}};
    this.jq = {q, spa:id, slider: id.find(".slider"), anchor: q.uriAnchor, win: q(window)};
    this.state = {retracted: true, anchor: {}};
  }
  copyAnchor(){ return this.jq.q.extend(true, {}, this.state.anchor);}

  changeAnchor(chat){
    const revise = this.copyAnchor(), anchor = this.jq.anchor; let ret_val = true;
    for(let key in chat){
      if(!chat.hasOwnProperty(key)) { continue;} if(key.indexOf('_') === 0) { continue;}
      revise[key] = chat[key]; let dep = '_' + key;
      if(chat[dep]){ revise[dep] = chat[dep];} else { delete revise[dep]; delete revise["_s" + dep];}
    }
    try{anchor.setAnchor(revise);} catch(e){ anchor.setAnchor(this.state.anchor, null, true); ret_val = false;}
    return ret_val;
  }
  res(bo, height){
    const c = this.config, ext_hi = c.extend.height, ret_hi = c.retract.height,
      is_open = height === ext_hi, is_closed = height === ret_hi, sliding = !is_open && !is_closed;
    if(bo){ return [sliding, ext_hi, c.extend.time, c.extend.title];}
    else { return [sliding, ret_hi, c.retract.time, c.retract.title];}
  }
  toggle(b){
    const s = this.jq.slider, [sliding, hi, time, title] = this.res(b, s.height()), anime = {height: hi};
    if(sliding) { return false;}
    s.animate(anime, time).attr("title", title);
    this.state.retracted = !b; return true;
  }
  onClick(){ this.changeAnchor({chat: (this.state.retracted ? "open" : "close")}); return false;}
  onHashChange(event){
    const previous = this.copyAnchor(), s = this.state, anchor = this.jq.anchor; let proposed;
    try{proposed = anchor.makeAnchorMap();} catch(e){anchor.setAnchor(previous, null, true); return false;}
    s.anchor = proposed;
    const dep_prev = previous._s_chat, dep_prop= proposed._s_chat;
    if(!previous || dep_prev !== dep_prop){
      switch (proposed.chat) {
        case "open": this.toggle(true); break;
        case "close": this.toggle(false); break;
        default: this.toggle(false); delete proposed.chat; anchor.setAnchor(proposed, null, true);
      }
    }
    return false;
  }

  testAnctor(){
    let suzie = { profile: "on",_profile: { uid : "suzie", status: "green"}}, anchor = this.jq.anchor;
    anchor.setAnchor(suzie);
    let res = anchor.makeAnchorMap();
    // http://127.0.0.1:5500/public/spa.html#!profile=on:uid,suzie|status,green
    console.log(res);
  }
  init(){
    const c = this.config, title = c.retract.title, {slider, anchor, win} = this.jq;
    slider.attr("title", title).on("click", () => this.onClick());
    // anchor.configModule({schema_map: c.anchor});
    win.bind("hashchange", e => this.onHashChange(e)).trigger("hashchange");

    // this.testAnctor();
    // setTimeout(() => { this.toggle(true);}, 3000);
    // setTimeout(() => { this.toggle(false);}, 8000);
  }
}


function ready(){ const s = new Spa($, $("#spa")); s.init();}
function nodeTest(){ console.log("nodeTest");}
if(typeof window === "undefined"){ nodeTest();} else { jQuery(ready);}

/*
node public/js/spa.js
*/