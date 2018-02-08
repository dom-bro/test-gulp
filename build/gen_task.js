require('colors')
const path = require('path')
const _ = require('lodash')
const gulp = require('gulp')
const debug = require('gulp-debug')
const logic = require('./logic_pipe')

/**
 * Gulp Task Generator
 */
module.exports = config => {
  let hot = true
  let changes = []

  /**
   * @private
   * @param {Function} done
   */
  function task (done) {
    const isHot = hot && changes.length
    logic(gulp.src(isHot ? changes : config.src))
      .pipe(debug({
        title: `${isHot ? 'Hot' : 'Full'} Build: `.yellow,
        showFiles: isHot,
      }))
      .pipe(config.plugins)
      .pipe(gulp.dest(config.dest))
      .onFinish(() => {
        console.log('Build Done!'.rainbow)
        done()
      })

    // 重置状态
    hot = true
    changes = []
  }
  task.displayName = config.taskName

  const build = gulp.series(task)
  const debouncedBuild = _.debounce(build, 100)

  // 1s 之内无文件保存动作做一次编译
  function watch (done) {
    build(done)
    build(done)
    // 如果同时保存的多个文件中存在模块文件（即 _ 开头的文件）就执行全编译，否则热编译
    // gulp.watch(config.src)
    //   .on('all', (e, p) => {
    //     if (hot) {
    //       // 收集变更
    //       if (/^_/.test(path.basename(p, path.extname(p)))) {
    //         hot = false
    //       } else {
    //         changes.push(p)
    //       }
    //     }
    //     debouncedBuild()
    //   })
  }

  return {
    task,
    watch,
  }
}

