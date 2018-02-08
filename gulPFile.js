const gulp = require('gulp')
const genTask = require('./build/gen_task')

const less = genTask({
  src: 'src/**/*.less',
  dest: 'dom-bro/dist',
  taskName: 'build:less',
  build: [],
})

gulp.task('build:less', done => less.task(done, true))

gulp.task('watch:less', less.watch)