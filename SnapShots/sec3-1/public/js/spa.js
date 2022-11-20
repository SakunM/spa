class Spa{
  constructor(q, id){
    const extend = { time: 2000, height: 450, title: "押すと縮むよ"},
          retract = { time: 300, height: 16, title: "押すと伸びるよ"};
    this.config = {extend: extend, retract: retract};
    this.jq = {q, spa:id, slider: id.find(".slider")};
    this.state = {retracted: true};
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
  onClick(){ this.toggle(this.state.retracted); return false;}
  init(){
    const config = this.config, title = config.retract.title, slider = this.jq.slider;
    slider.attr("title", title).on("click", () => this.onClick());
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