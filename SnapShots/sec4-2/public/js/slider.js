class Slider{
  constructor(slider){
    const open = { time: 1000, em : 18, min_em : 10, title: "押すと縮むよ"},
          close = { time: 250, em : 2,  title: "押すと伸びるよ"},
          px = { hidden: 0, closed: 0, opened: 0};
    this.config = { open, close, win_min_em: 20, anchor: null}
    this.state = { target: null, position: undefined, rate: 0, px};
    this.jq = {slider, win: $(window)};
  }
  getEmSize(elem){ return Number(getComputedStyle(elem,'').fontSize.match(/\d*\.?\d*/)[0]);}
  
  setPxSize(){
    const c = this.config, s = this.state, {slider, win} = this.jq; s.rate = this.getEmSize(slider.get(0)); 
    const rate = s.rate, win_min_em = Math.floor((win.height() / rate) + 0.5),
      open_em = win_min_em > c.win_min_em ? c.open.em : c.open.min_em;
    s.px.closed = c.close.em * rate; s.px.opened = open_em * rate;
    let hi = (open_em -2) * rate; slider.css({height: hi});
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
    s.position = '';
    jq.slider.animate({height: hi}, time, () => { jq.slider.prop("title", title); s.position = pos;});
    return true;
  }
  onClickToggle(){
    const c = this.config, s = this.state, anchor = c.anchor;
    if(s.position === "opened") {anchor("closed");}
    if(s.position === "closed") {anchor("opened");}
    return false;
  }
  init(anchor){
    const c = this.config, s = this.state, jq = this.jq;
    c.anchor = anchor.chat_anchor;
    this.setPxSize();
    jq.slider.prop("title", c.close.title);
    jq.slider.click(() => this.onClickToggle());
    s.position = "closed";
  }
}