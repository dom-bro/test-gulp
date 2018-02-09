/**
 * NodeJS Stream 提供的 pipe 接口只支持传入 Stream 实例，对输入流里的数据做一次处理。
 * 该插件是为了满足如下需求：
 *     - 传入一个 Array，依次 pipe 数组里的每个 Stream；
 *     - 传入一个 Function，在里面执行业务逻辑，最后 pipe 函数 return 出来的 Stream 或 Stream 数组；
 */
const Stream = require('stream')

module.exports = stream => new NodeStream(stream)

class NodeStream {
  /**
   * @param {Stream} stream
   */
  constructor(stream) {
    const self = this

    self.stream = stream
  }
  /**
   * @param {Stream | Array | Function} processor 由于 stream.Writable 在 stream.end() 之后再调用 stream.write() 将会导致错误，因此请确保每次执行 pipe 时传入它的实参都是一个全新的可用的 Stream 实例，这种情况下 Function 就会很有用。
   * @returns {NodeStream}
   */
  pipe(processor) {
    const self = this

    if (processor) {
      const type = Object.prototype.toString.call(processor)

      if (processor instanceof Stream) self.stream = self.stream.pipe(processor)
      else if (type === '[object Array]') processor.forEach(p => self.stream = self.stream.pipe(p))
      else if (type === '[object Function]') self.pipe(processor.call(self))
      else throw new TypeError('[Logic Pipe]：pipe 方法的实参类型必须是 {Stream | Array | Function}')
      
    }
    return self
  }
  /**
   * @returns {Stream} 返回传入的原始 stream
   */
  raw() {
    return this.stream
  }

  /**
   * @param {Function} cb 流写入关闭后执行回调
   */
  onFinish(cb) {
    const self = this

    self.stream.on('finish', () => {
      cb.call(self)
    })
  }
}