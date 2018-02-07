const path = require('path')
const gulp = require('gulp')
const less = require('gulp-less')
const debug = require('gulp-debug')

function buildLess(){
  return gulp.src('./src/**/*.less', {since: gulp.lastRun(buildLess)})
    .pipe(debug())
    .pipe(less())
    .pipe(gulp.dest('./dom-bro/dist'))
}

gulp.task('watch:less', () => {
  const watcher = gulp.watch('src/**/*.less')
  watcher.on('all', (e, p) => {
    const isSubmodule = /^_/.test(path.basename(p, path.extname(p)))
    console.log(isSubmodule)
    console.log(e + ' : ' + p)
  })
})