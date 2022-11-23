class Slider{
  constructor(slider){
    this.config = { anchor: null, helper: new SliderUtil()};
    this.state = { user: undefined, send: undefined, chatee: undefined, isOpen: false};
    this.jq = {
      slider,
      head:   slider.find(".head"), 
      toggle: slider.find(".head > .toggle"),
      title: slider.find(".head > .title"),
      list:   slider.find(".list"),
      msg:   slider.find(".msg"),
      input:   slider.find(".form > input"),
      send:   slider.find(".form > .send"),
      win:    $(window),
      q: $,
      event: $.gevent
    };
  }
  removeSlider(){ this.jq.slider.remove(); this.jq = {}; this.state = {};}
  
  handleResize(){
    const c = this.config, j = this.jq;
    if(!j.slider){ return false;} c.helper.setPxSize(j.slider); return true;
  }
  setPosition(pos){
    const c = this.config, s = this.state, j = this.jq; if(!s.isOpen) { return false;}
    if(pos == c.helper.state.position) { return ture;}
    const {slider, head, toggle} = j, helper = c.helper, [height, time, title, text] = helper.forSlider(pos);
    slider.animate({height}, time, () => { head.prop("titel", title); toggle.text(text); helper.state.position = pos;});
    return true; 
  }
  scrollChat(){
    const msg = this.jq.msg; msg.animate({ scrollTop: msg.prop("scrollHeight") - msg.height()}, 150); 
  }
  writeAlert(msg){
    this.jq.msg.append(`<div class="log-alert">${msg}</div>`); this.scrollChat();
  }
  writeChat(name, text, user){
    const msg_class = user ? "log-me" : "log-msg", div = `<div class="${msg_class}">${name} : ${text}</div>`;
    this.jq.msg.append(div); this.scrollChat();
  }
  login(user, send, chatee){
    const c = this.config, s = this.state;
    s.isOpen = true; s.user = user; s.send = send, s.chatee = chatee; c.anchor("open");
  }
  listChange(state, chat, list){
    const persons = state.db(), chatee = chat.chatee, user = state.user.name, c = this.config;
    let html = ''; persons.each(p => html += c.helper.listHtml(p, chatee, user));
    list.html(html); 
  }
  setChatee(pair, list){
    const c = this.config, s = this.state, j = this.jq, old = pair.old, now = pair.now,
      helper = c.helper, title = j.title;
    j.input.focus(); let msg = '';
    if(!now) { msg = helper.whenLeftChat(old); title.text("Chat"); return false;}
    if(old){ list.find(`[data-id=${old.id}]`).removeClass("list-select");}
    list.find(`[data-id=${now.id}]`).addClass("list-select");
    this.writeAlert("Now chetteing with " + now.name);
    title.text("Chat with " + now.name); return true;
  }
  updateChat(chat){
    const {sender, user, msg} = chat;
    if(!sender) {this.writeAlert(msg); return false;}
    this.writeChat(sender.name, msg, user); if(user){ let input = this.jq.input; input.val(''); input.focus();}
  }
  logout(){
    const c = this.config, s = this.state, j = this.jq, {title, input} = j;
    j.list.empty(); title.text("Chat"); input.val(''); j.msg.empty();
    c.anchor("close"); setTimeout(()=>s.isOpen = false, 500);
    return true;
  }
  onSubmitMsg(){
    const c = this.config, s = this.state, j = this.jq, {input, send} = j, msg = input.val();
    if(msg.tirm === ''){ return false;} s.send(msg); input.focus(); send.addClass("send-select");
    setTimeout(()=> send.removeClass("send-select"), 250); input.val(''); return false;
  }
  onTapList(event){
    const q = this.jq.q, tap = q(event.target); if(!tap.hasClass("list-name")) { return false;}
    let id = tap.attr("data-id"); if(!id) { return false;}
    this.state.chatee(id); return false;
  }
  aboutMamoLogin(spa){
    let m = spa.config.model; m.login("mamo");
    setTimeout(()=>this.logout(), 7000);
  }
  webTest(spa){
    this.config.helper.webTest(spa);
    // this.aboutMamoLogin(spa);
  }
  init(anchor){
    const c = this.config, s = this.state, j = this.jq, {event, head, list, send} = j, helper = c.helper;
    c.anchor = anchor;
    event.subscribe(list, "spa-login", (_, user, send, chatee) => this.login(user, send, chatee));
    event.subscribe(list, "spa-listchange", (_, state, chat) => this.listChange(state, chat, list));
    event.subscribe(list, "spa-updatechat", (_, chat) => this.updateChat(chat));
    event.subscribe(list, "spa-setchatee", (_, pair) => this.setChatee(pair, list));
    event.subscribe(list, "spa-logout", () => this.logout());
    head.prop("title", helper.config.close.title); helper.setPxSize(j.slider);
    list.bind("click", e => this.onTapList(e)); send.bind("click", () => this.onSubmitMsg());
    send.keypress(e => { if(e.which === 13){ this.onSubmitMsg();}});
  }
}