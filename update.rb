require 'fileutils'

def update(path) 
  sec = "./SnapShots/" + path; pub = sec + "/public"; scss = sec + "/scss"; views = sec + "/views";
  Dir::mkdir(sec); Dir::mkdir(pub); FileUtils.cp_r("views/", views); FileUtils.cp_r("scss/", scss);
  FileUtils.cp_r("public/css/", pub + "/css/");
  FileUtils.cp_r("public/js/", pub + "/js/");
  FileUtils.cp("public/spa.html", pub + "/spa.html");
end

if __FILE__ == $0 then
  update(ARGV[0]);
end

