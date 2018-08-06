import {HttpLogHandler} from './http-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {INgLogHandler} from './ng-log-handler'

describe('HttpLogHandler', () => {
  let xhrSpy

  beforeEach(() => {
    xhrSpy = jasmine.createSpyObj('xhr', ['send', 'open', 'setRequestHeader', 'onreadystatechange'])
  })

  function getHandler(options = {}): INgLogHandler {
    const handler: any = new HttpLogHandler(options)
    handler.XmlHttpRequest = () => xhrSpy

    return handler
  }

  it('has log level that is undefined by default', () => {
    expect(getHandler().logLevel).toBeUndefined()
  })

  it('sets the log level if it is provided', () => {
    const handler = getHandler({logLevel: NgLogLevel.info})

    expect(handler.logLevel).toEqual(NgLogLevel.info)
  })

  it('sends an http request', () => {
    getHandler().handleLog(NgLogLevel.log, 'should send')

    expect(xhrSpy.send).toHaveBeenCalled()
  })

  it('posts to /log asynchronously by default', () => {
    getHandler().handleLog(NgLogLevel.log, 'should post')

    expect(xhrSpy.open).toHaveBeenCalledWith('POST', '/log', true)
  })

  it('sets the request header', () => {
    getHandler().handleLog(NgLogLevel.log, 'log message')

    expect(xhrSpy.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
  })

  describe('circular references', () => {
    it('serializes circular references appropriately', () => {
      const foo: any = {someVal: 5}
      const bar: any = {nestedObj: foo}
      foo.circularRef = bar

      getHandler().handleLog(NgLogLevel.log, bar)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [{nestedObj: {someVal: 5, circularRef: '[Circular]'}}]
      })
    })

    it('handles infinite circular ref', () => {
      const foo: any = {}
      foo.anotherFoo = foo

      getHandler().handleLog(NgLogLevel.log, foo)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [{anotherFoo: '[Circular]'}]
      })
    })

    it('does not incorrectly identify repeated value references as ciruclar references', () => {
      const bar: any = {one: 1, anotherOne: 1}

      getHandler().handleLog(NgLogLevel.log, bar)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [bar],
      })
    })

    it('does not incorrectly identify repeated object references as ciruclar references', () => {
      const foo = {}
      const bar: any = {foo: foo, anotherFoo: foo}

      getHandler().handleLog(NgLogLevel.log, bar)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [bar],
      })
    })
  })

  describe('handling response', () => {
    let debugSpy

    beforeEach(() => {
      debugSpy = spyOn(console, 'debug')

    })

    it('ignores ready states except for done', () => {
      getHandler().handleLog(NgLogLevel.log, 'log message')

      xhrSpy.status = 404

      xhrSpy.readyState = XMLHttpRequest.HEADERS_RECEIVED
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.UNSENT
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.OPENED
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.LOADING
      xhrSpy.onreadystatechange({} as Event)

      expect(debugSpy).not.toHaveBeenCalled()
    })

    it('logs error if status is not 200 and request is done', () => {
      getHandler().handleLog(NgLogLevel.log, 'log message', {x: 'yz'})

      xhrSpy.status = 404
      xhrSpy.readyState = XMLHttpRequest.DONE
      xhrSpy.onreadystatechange({} as Event)

      expect(debugSpy).toHaveBeenCalledWith('XHR failed', xhrSpy)
      expect(debugSpy).toHaveBeenCalledWith('Log was not posted - ', 'log', ['log message', {x: 'yz'}])
    })

    it('logs an debug message if something fails', () => {
      const error = new Error('send failed')
      xhrSpy.send.and.callFake(() => {
        throw error
      })

      getHandler().handleLog(NgLogLevel.log, 'log message', {x: 'yz'})

      expect(debugSpy).toHaveBeenCalledWith('Error while trying to post log - ', error)
      expect(debugSpy).toHaveBeenCalledWith('Log was not posted - ', 'log', ['log message', {x: 'yz'}])
    })
  })

  describe('with options', () => {
    it('overrides the post route', () => {
      const route = '/my/route/for/logging'
      const handler = getHandler({httpPostRoute: route})

      handler.handleLog(NgLogLevel.log, 'log message')

      expect(xhrSpy.open).toHaveBeenCalledWith(jasmine.anything(), route, jasmine.anything())
    })

    it('debug sends http request for all log levels', () => {
      const handler = getHandler({logLevel: NgLogLevel.debug})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(5)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"debug"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"info"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"log"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for info and up when loglevel is info', () => {
      const handler = getHandler({logLevel: NgLogLevel.info})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(4)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"info"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"log"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for log and up when loglevel is log', () => {
      const handler = getHandler({logLevel: NgLogLevel.log})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(3)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"log"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for warn and up when loglevel is warn', () => {
      const handler = getHandler({logLevel: NgLogLevel.warn})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(2)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for only error messages when loglevel is error', () => {
      const handler = getHandler({logLevel: NgLogLevel.error})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(1)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })
  })

  it(`formats the data correctly`, () => {
    const handler = getHandler()

    handler.handleLog(NgLogLevel.log, 'log')

    expect(xhrSpy.send).toHaveBeenCalledWith(`{"logLevel":"log","params":["log"]}`)
    expect(xhrSpy.send).toHaveBeenCalledTimes(1)
  })

  it(`formats the errors correctly`, () => {
    const handler = getHandler()
    const error = new Error(`log error`)

    handler.handleLog(NgLogLevel.log, error)

    const args = (<any>xhrSpy).send.calls.argsFor(0)
    const xhrSendPayload = JSON.parse(args[0])
    expect(xhrSendPayload).toEqual({logLevel: 'log', params: [{message: error.message, stack: error.stack}]})
  })

  it('removes angular error properties from serialization', () => {
    const handler = getHandler()
    const error: any = new Error(`log error`)
    error.ngDebugContext = 'context'
    error.ngErrorLogger = 'logger'
    error.DebugContext_ = 'other context'

    handler.handleLog(NgLogLevel.log, error)

    const args = (<any>xhrSpy).send.calls.argsFor(0)
    const xhrSendPayload = JSON.parse(args[0])
    expect(xhrSendPayload).toEqual({logLevel: 'log', params: [{message: error.message, stack: error.stack}]})
  })

  it('does not post DebugContext_ objects', () => {
    const handler = getHandler()

    class DebugContext_ {
    }

    const context = new DebugContext_()

    handler.handleLog(NgLogLevel.log, 'ERROR CONTEXT', context)

    const args = (<any>xhrSpy).send.calls.argsFor(0)
    const xhrSendPayload = JSON.parse(args[0])
    expect(xhrSendPayload).toEqual({logLevel: 'log', params: ['ERROR CONTEXT', '[DebugContext_]']})
  })

  it(`does not change the error property configurable descriptor`, () => {
    // this test is in here due to a previous implementation that would alter the Error object to get it to serialize properly.
    // However, the error object should not be altered for serialization purposes.

    const handler = getHandler()
    const error = new Error(`log error`)

    handler.handleLog(NgLogLevel.log, [error])

    const messageDescriptor = Object.getOwnPropertyDescriptor(error, 'message')
    const stackDescriptor = Object.getOwnPropertyDescriptor(error, 'stack')
    expect(messageDescriptor.enumerable).toBeFalsy()
    expect(stackDescriptor.enumerable).toBeFalsy()
  })

})
