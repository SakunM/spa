class AvatarUtil{
  getRandRGB(){
    const rgb = [1,2,3].map(v => Math.trunc(Math.random() * 256)); return `rgb(${rgb.join()})`; 
  }
  getRandRGBTest(){ let res = this.getRandRGB(); console.log(res);}

  setBox(person, chatee, q, nav, user){
    if(person.isAnon()){ return false;} let claases = ["avatr-box"];
    if(chatee){ if(person.id === chatee.id) { claases.push("avatr-is-chatee");}}
    if(person.isUser(user.name)) { claases.push("avatr-is-user");}
    let div = claases.join(' '); q("<div/>").addClass(div).css(person.css).attr("data-id", String(person.id))
      .prop("title", person.name).text(person.name).appendTo(nav);
    return true;
  }
  setBoxTest(){
    let p = { isAnon: () => false, id: "id_01", isUser: _ => true, css: {}}, c = {id: "id_01"}, u = {name: "mamo"};
    let res = this.setBox(p,c,$,$("<div/>"), u); console.log(res);
  }
  offset(target, nav){
    const tar_offset = target.offset(), nav_offset = nav.offset(); 
    tar_offset.top -= nav_offset.top; tar_offset.left -= nav_offset.left;
    return tar_offset;
  }
  offsetTest(){
    let target = { offset: () => { return {top: 50, left: 30}}}, nav = { offset: () => {return {top: 0, left: 0}}};
    let res = this.offset(target, nav); console.log(res);
  }
  background(target){
    let bg = target.css("background"), index = bg.indexOf("none");
    if(index === -1){ return bg;} else { return bg.substring(0, index -1);}
  }
  css(target){
    const top = parseInt(target.css("top")), left = parseInt(target.css("left")); 
    return { top, left, "background": this.background(target)};
  }
  cssTest(){
    let target = { css: arg => {
      switch (arg) {
        case "top": return 40;
        case "left": return 55;
        case "background": return "none";
      }
    }};
    let res = this.css(target); console.log(res);
  }
  webTest(){
    // this.setBoxTest(); this.offsetTest(); this.cssTest(); this.getRandRGBTest();
  }
}