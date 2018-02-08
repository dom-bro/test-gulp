const gulp = require('gulp')
const less = require('gulp-less')
const genTask = require('./build/gen_task')

const Less = genTask({
  src: 'src/**/*.less',
  dest: 'dist',
  taskName: 'build:less',
  plugins: [
    less(),
  ],
})

gulp.task('build:less', Less.task)

gulp.task('watch:less', Less.watch)