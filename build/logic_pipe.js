/**
 * NodeJS Stream 提供的 pipe 接口只支持传入 Stream 实例，对输入流里的数据做一次处理。
 * 该插件是为了满足如下需求：
 *     - 传入一个 Array，依次 pipe 数组里的每个 Stream；
 *     - 传入一个 Function，在里面执行业务逻辑，最后 pipe 函数 return 出来的 Stream 或 Stream 数组；
 *
 * 注意：
 *     - 串联 pipe 完之后调用 end 来取到 node 的 Stream，这对某些插件（比如 gulp 需要 return）极为重要；
 */
const Stream = require('stream')

class NodeStream {
  /**
   * @param {Stream} stream
   */
  constructor(stream) {
    const self = this

    self.stream = stream
  }
  /**
   * @param {Stream} destination
   */
  streamPipe(destination) {
    const self = this

    if (destination instanceof Stream) {
      self.stream = self.stream.pipe(destination)
    } else {
      throw new Error(`[Logic Pipe]：pipe 方法的输入类型是 ${destination.constructor.name}，而不是所期望的 Stream！`)
    }
  }

  /**
   * @param {Stream|Array|Function} processor 如果传入 Function，那么这个 Function 的返回值期望是 {Stream|Array}
   * @returns {NodeStream}
   */
  pipe(processor) {
    const self = this

    if (processor) {
      switch (Object.prototype.toString.call(processor)) {
        case '[object Array]':
          processor.forEach(p => self.streamPipe(p))
          break
        case '[object Function]':
          self.pipe(processor.call(self))
          break
        default:
          self.streamPipe(processor)
          break
      }
    }
    return self
  }
  raw() {
    return this.stream
  }
  onFinish(cb) {
    const self = this

    self.stream.on('finish', () => {
      cb.call(self)
    })
  }
}
module.exports = stream => new NodeStream(stream)