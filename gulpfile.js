const gulp = require("gulp"), sass = require("gulp-sass"), pug = require("gulp-pug");

gulp.task("scss", () => {
  return gulp.src("./scss/**/*.scss", "! ./scss/**/_*.scss")
  .pipe(sass({outputStyle: "expanded"}))
  .pipe(gulp.dest("./public/css"));
});

gulp.task("pug", () => {
  return gulp.src("./views/**/*.pug", "!./views/**/_*.pug")
  .pipe(pug({ pretty: true}))
  .pipe( gulp.dest("./public"));
});

gulp.task("watch", () => {
  gulp.watch("./scss/**/*.scss", gulp.task("scss"));
  gulp.watch("./views/**/*.pug", gulp.task("pug"));
});

/*
npx gulp watch
*/