class SliderUtil {
  constructor(){
    const open = { em: 20, title: "ログアウトしたら自然に閉じるよ", time: 1000, min_em: 10},
         close = { em: 2.5, title: "ログインしたら自然に伸びるよ", time: 300};
    this.config = { open, close, hi_min_em: 20};
    this.state = { position: "close", open: undefined, close: undefined};
    this.jq = { win: $(window), style: (e,s) => getComputedStyle(e,s)};
  }
  getEmSize(elem){ return Number(this.jq.style(elem, '').fontSize.match(/\d*\.?\d*/)[0]);}
  setPxSize(slider){
    const c = this.config, s = this.state, j = this.jq, {open, close, hi_min_em} = c,
      late = this.getEmSize(slider.get(0)), {win} = j, win_hi_em = Math.trunc((win.height()/late) + 0.5),
      open_hi_em = win_hi_em > hi_min_em ? open.em : open.min_em;
    s.open = open_hi_em * late; s.close = close.em * late; 
  }
  forSlider(pos){
    const c = this.config, s = this.state, j = this.jq, {open, close} = c; let hi, time, title, text;
    switch(pos){
      case "open": hi = s.open; time = open.time; title = open.title; text = '='; break;
      case "close": hi = s.close; time = close.time; title = close.title; text = '+'; break;
    }
    return [hi, time, title, text];
  }
  whenLeftChat(old){ if(old){ return old.name + " has lift the chat.";} return "Your frend has letf chat.";}
  whenLeftChatTest(){ let res = this.whenLeftChat(); console.log(res);}

  listHtml(person, chatee, user){
    let select = '';
    if(person.isAnon() || person.name === user) { return '';}
    if(chatee && chatee.id === person.id){ select = "list_select";}
    return `<div class="list-name ${select}" data-id="${person.id}">${person.name}</div>`;
  }

  listHtmlTest(){
    let p = { name: "pebled", isAnon: () => false, id: "id_01"};
    let c = {id: "id_01"}
    let res = this.listHtml(p, c, "mamo");
    console.log("res = ", res);
  }
  webTest(spa){
    // this.listHtmlTest(); this.whenLeftChatTest();
  }
}