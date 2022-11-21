class Spa{
  constructor(q, id){
    this.config = {anchor: { chat: {opened: true, closed: true}}};
    this.state = {anchor: {}};
    this.jq = {q, spa:id, anchor: q.uriAnchor, win: q(window)};
    this.slider = new Slider(id.find(".slider"));
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
    s.anchor = proposed; const slider = this.slider; let is_ok = true;
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

  init(){
    const c = this.config, s = this.state, {anchor, win} = this.jq, slider = this.slider;
    anchor.configModule({schema_map: c.anchor});
    slider.init({chat_anchor: pos => {this.setAnchor(pos);}})
    win.bind("hashchange", e => this.onHashChange()).trigger("hashchange");
  }
}


function ready(){ const s = new Spa($, $("#spa")); s.init();}
function nodeTest(){ console.log("nodeTest");}
if(typeof window === "undefined"){ nodeTest();} else { jQuery(ready);}

/*
node public/js/spa.js
*/