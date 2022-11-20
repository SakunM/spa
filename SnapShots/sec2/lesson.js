function prison(){
  console.log(prisoner);
  var prisoner = "Now I'am defined";
  console.log(prisoner);
}

var regular_joe = "Regulaer Joe";

function g_prison(){
  console.log(regular_joe);
  var regular_joe = "hoge";
}
function liftup(){
  // prison();
  g_prison();
}

if(require.main === module){
  liftup();
}