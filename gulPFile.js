const gulp = require('gulp')
const less = require('gulp-less')
const genTask = require('./build/gen_task')

const configs = [{
  taskName: 'less',
  src: 'src/**/*.less',
  dest: 'dist',
  plugins: () => [
    less(),
  ],
}]

configs.map(genTask).forEach(task => {
  let {name} = task

  gulp.task(`build:${name}`, task.build)

  gulp.task(`watch:${name}`, task.watch)
})
