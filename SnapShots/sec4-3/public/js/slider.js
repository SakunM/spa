class Slider{
  constructor(slider){
    const open = { time: 1000, em : 20, min_em : 10, title: "押すと縮むよ"},
          close = { time: 250, em : 2,  title: "押すと伸びるよ"},
          px = { hidden: 0, closed: 0, opened: 0};
    this.config = { open, close, win_min_em: 20, anchor: null}
    this.state = { target: null, position: "closed", rate: 0, px};
    this.jq = {
      slider: slider,
      head:   slider.find(".head"), 
      toggle: slider.find(".head > .toggle"), 
      title:  slider.find(".head > .title"), 
      sizer:  slider.find(".sizer"), 
      msgs:   slider.find(".sizer > .msgs"),
      box:    slider.find(".sizer > .box"),
      input:  slider.find(".sizer > .box > input[type=text]"),
      win:    $(window)
    };
  }
  removeSlider(){
    let jq = this.jq, slider = jq.slider, s = this.state, c = this.config; 
    if(slider) { slider.remove(); jq = {};} s.position = "closee"; c.anchor = null;
  }
  getEmSize(elem){ return Number(getComputedStyle(elem,'').fontSize.match(/\d*\.?\d*/)[0]);}
  
  setPxSize(){
    const c = this.config, s = this.state, {slider,sizer, win} = this.jq; s.rate = this.getEmSize(slider.get(0)); 
    const rate = s.rate, win_min_em = Math.floor((win.height() / rate) + 0.5),
      open_em = win_min_em > c.win_min_em ? c.open.em : c.open.min_em;
    s.px.closed = c.close.em * rate; s.px.opened = open_em * rate;
    let hi = (open_em -2) * rate; sizer.css({height: hi});
  }
  handleResize(){
    const slider = this.jq.sizer, s = this.state;
    if(!slider){ return false;} this.setPxSize();
    if(s.position === "opened"){ slider.css({height: s.px.opened});} 
    return true;
  }
  setSlider(pos){
    const c = this.config, s = this.state, jq = this.jq;
    if(s.position === pos){ return true};
    let hi, time, title, text;
    switch(pos){
      case "opened": hi = s.px.opened; time = c.open.time;  title = c.open.title;  text = '='; break;
      case "closed": hi = s.px.closed; time = c.close.time; title = c.close.title; text = '+'; break;
      case "hidden": hi = 0;           time = c.open.time;  title = '';            text = '+'; break;
      default      : return false;
    } 
    s.position = pos;
    jq.slider.animate({height: hi}, time, () => { jq.toggle.prop("title", title); jq.toggle.text(text)});
    return true;
  }
  onClickHead(){
    const c = this.config, s = this.state, anchor = c.anchor;
    if(s.position === "opened") {anchor("closed");}
    if(s.position === "closed") {anchor("opened");}
    return false;
  }
  init(anchor){
    const c = this.config, s = this.state, jq = this.jq;
    c.anchor = anchor.chat_anchor;
    this.setPxSize();
    jq.toggle.prop("title", c.close.title);
    jq.head.click(() => this.onClickHead());
  }
}