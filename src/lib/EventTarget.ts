class EventTarget {
  handlers: Record<string, Function[]> = {}
  constructor() {
  }
  on(type: string, handler: Function) {
    if (typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = []
    }
    this.handlers[type].push(handler)
  }
  once(type: string, handler: Function) {
    let self = this
    const h = (data: any) => {
      self.remove(type, h)
      handler(data)
    }
    this.on(type, h)
  }
  emit(type: string, event: any = null) {
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type]
      for (var i = handlers.length - 1; i >= 0; i--) {
        handlers[i](event)
      }
    }
  }
  remove(type: string, handler: Function) {
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type]
      for (var i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1)
          break
        }
      }
    }
  }
}
export default EventTarget
