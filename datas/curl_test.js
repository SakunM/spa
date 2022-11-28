const exec = require('child_process').execSync;
// let res = exec("curl http://localhost:3000/user/create -d {}").toString();
// console.log(res);
function invoke(uri){ return `Invoke-WebRequest -Uri "${uri}" -Method POST`;}

function body(obj){
  let objs = Object.entries(obj), name = objs[0], css = objs[1];
  let cs = Object.entries(css[1]), bg = cs[0], t = cs[1], l=cs[2];
  let front = ` -Body (@{"${name[0]}" = "${name[1]}"; "${css[0]}" = @{ "${bg[0]}" = `,
    midle = `"${bg[1]}"; "${t[0]}" = ${t[1]}; "${l[0]}" = ${l[1]}}}`;
  return front + midle + " | ConvertTo-Json)";
}
function test(){
  let post = invoke("http://localhost:3000/user/create");
  let obj = {name: "hoge", css: { backgraund: "#fff", left: 20, top: 50}}, res = body(obj), content = ' -ContentType "application/json"';
  let arg = post + res + content;
  console.log(arg);
}
if(require.main === module){
  test();
}