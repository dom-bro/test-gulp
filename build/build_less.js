require('colors')
const path = require('path')
const _ = require('lodash')
const gulp = require('gulp')
const less = require('gulp-less')
const debug = require('gulp-debug')
const logic = require('./logic_pipe')

const config = {
  src: 'src/**/*.less',
  dest: 'dom-bro/dist',
  taskName: 'build:less',
  build: [],
}

let changes = [],
  hot = true

const task = done => {
  logic(gulp.src(hot ? changes : config.src))
    .pipe(debug({title: `${hot ? 'Hot' : 'Full'} Build: `.yellow}))
    .pipe(less())
    .pipe(gulp.dest(config.dest))
    .on('finish', () => {
      // 一次编译完毕重置状态
      hot = true
      changes = []

      console.log('Build Done!'.rainbow)
      done()
    })
}
task.displayName = config.taskName

gulp.task('build:less', task)

const build = _.debounce(gulp.series(task), 100)

// 1s 之内无文件保存动作做一次编译
exports.watch = () => {
  // 如果同时保存的多个文件中存在模块文件（即 _ 开头的文件）就执行全编译，否则热编译
  gulp.watch(config.src)
    .on('all', (e, p) => {
      if (hot) {
        // 收集变更
        if (/^_/.test(path.basename(p, path.extname(p)))) {
          hot = false
        } else {
          changes.push(p)
        }
      }
      build()
    })
}

exports.task = task