class Spa{
  constructor(q, id){
    const extend = { height: 434, title: "押すと縮むよ"}, retract = { height: 16, title: "押すと伸びるよ"};
    this.config = {extend: extend, retract: retract};
    this.jq = {q, spa:id, slider: id.find(".slider")};
  }
  result(height){
    const config = this.config, ext_hi = config.extend.height, ret_hi = config.retract.height;
    if(height === ret_hi){ return {title: config.extend.title, height: ext_hi};} 
    if(height === ext_hi){ return {title: config.retract.title, height: ret_hi};} 
  }
  toggle(){
    const slider = this.jq.slider, res = this.result(slider.height()), anime = {height: res.height};
    slider.animate(anime).attr("title", res.title);
  }
  onClick(){ this.toggle(); return false;}
  init(){
    const config = this.config, title = config.retract.title, slider = this.jq.slider;
    slider.attr("title", title).on("click", () => this.onClick());
  }
}


function ready(){ const s = new Spa($, $("#spa")); s.init();}
function nodeTest(){ console.log("nodeTest");}
if(typeof window === "undefined"){ nodeTest();} else { jQuery(ready);}

/*
node public/js/spa.js
*/