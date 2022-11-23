class Avatar{
  constructor(){
    this.config = {helper: new AvatarUtil()};
    this.state  = {target: null, drag: null, update: null};
    this.jq     = { q: $, nav: undefined, event: $.gevent};
  }
  updateAvatar(target){
    const helper = this.config.helper, css = helper.css(target), id = target.attr("data-id");
    this.state.update({id: id, css: css});
  }
  listChange(state,chat){
    const c = this.config, s = this.state, j = this.jq, helper = c.helper, {nav, q} = j;
    let db = state.db(), user = state.user, chatee = chat.chatee;
    if(user.isAnon()){ return false;}
    s.update = chat.avatar; nav.empty();
    db.each(p => helper.setBox(p, chatee, q, nav, user));
  }
  setChatee(pair){
    const nav = this.jq.nav, now = pair.now, old = pair.old;
    if(old){ nav.find(`.avatr-box[data-id=${old.cid}]`).removeClass("avatr-is-chatee");}
    if(now){ nav.find(`.avatr-box[data-id=${now.cid}]`).addClass("avatr-is-chatee");}
  }
  logout(){ this.jq.nav.empty();}

  onTapNav(event){
    const q = this.jq.q, target = q(event.elem_target).closest(".avatr-box");
    if(target.length === 0) { return false;}
    target.css({"background": this.config.helper.getRandRGB()});
    this.updateAvatar(target); 
  }
  onHeldStart(event){
    const c = this.config, s = this.state, j = this.jq, {q, nav} = j, helper = c.helper,
      target = q(event.elem_target).closest(".avatr-box");
    if(target.length === 0) { return false;}
    s.target = target; s.drag = helper.offset(target, nav);
    s.color = target.css("background");
    target.addClass("avatr-is-drag").css("background", ''); return true;
  }
  onHeldMove(event){
    const drag = this.state.drag; if(!drag){ return false;} 
    drag.top += event.px_delta_y; drag.left += event.px_delta_x;
    this.state.target.css({ top: drag.top, left: drag.left});
    return true;
  }
  onHeldEnd(){
    const s = this.state, target = s.target; if(!target){ return false;} 
    target.removeClass("avatr-is-drag").css("background", s.color);
    s.color = undefined, s.drag = null, s.target = null;
    this.updateAvatar(target); return true;
  }
  webTest(spa){
    this.config.helper.webTest(spa);
    // let m = spa.config.model; m.login("mamo");
  }
  init(nav){
    const c = this.config, s = this.state, j = this.jq,  event = j.event; j.nav = nav;
    event.subscribe(nav, "spa-listchange", (_, state, chat) => this.listChange(state,chat));
    event.subscribe(nav, "spa-setchatee", (_, pair) => this.setChatee(pair));
    event.subscribe(nav, "spa-logout", () => this.logout());

    nav.bind("utap", e => this.onTapNav(e)).bind("uheldstart", e => this.onHeldStart(e))
      .bind("uheldmove", e => this.onHeldMove(e)).bind("uheldend", () => this.onHeldEnd());
  }
}