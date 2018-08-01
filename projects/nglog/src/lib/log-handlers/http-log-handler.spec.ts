import {HttpLogHandler} from './http-log-handler'
import {NgLogLevel} from '../ng-log-level'

describe('HttpLogHandler', () => {
  let xhrSpy

  beforeEach(() => {
    xhrSpy = jasmine.createSpyObj('xhr', ['send', 'open', 'setRequestHeader', 'onreadystatechange'])
  })

  function getHandler(options = {}): HttpLogHandler {
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
    const handler: any = getHandler()

    handler.log('should send')

    expect(xhrSpy.send).toHaveBeenCalled()
  })

  it('posts to /log asynchronously by default', () => {
    const handler: any = getHandler()

    handler.log('should post')

    expect(xhrSpy.open).toHaveBeenCalledWith('POST', '/log', true)
  })

  it('sets the request header', () => {
    const handler: any = getHandler()

    handler.log('log message')

    expect(xhrSpy.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
  })

  describe('circular references', () => {
    it('serializes circular references appropriately', () => {
      const handler: any = getHandler()
      const foo: any = {someVal: 5}
      const bar: any = {nestedObj: foo}
      foo.circularRef = bar

      handler.log(bar)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [{nestedObj: {someVal: 5, circularRef: '[Circular]'}}]
      })
    })

    it('handles infinite circular ref', () => {
      const handler: any = getHandler()
      const foo: any = {}
      foo.anotherFoo = foo

      handler.log(foo)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [{anotherFoo: '[Circular]'}]
      })
    })

    it('does not incorrectly identify repeated value references as ciruclar references', () => {
      const handler: any = getHandler()
      const bar: any = {one: 1, anotherOne: 1}

      handler.log(bar)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [bar],
      })
    })

    it('does not incorrectly identify repeated object references as ciruclar references', () => {
      const handler: any = getHandler()
      const foo = {}
      const bar: any = {foo: foo, anotherFoo: foo}

      handler.log(bar)

      const args = (<any>xhrSpy).send.calls.argsFor(0)
      const xhrSendPayload = JSON.parse(args[0])
      expect(xhrSendPayload).toEqual({
        logLevel: 'log',
        params: [bar],
      })
    })
  })

  describe('handling response', () => {
    let errorSpy

    beforeEach(() => {
      errorSpy = spyOn(console, 'error')

    })

    it('ignores ready states except for done', () => {
      const handler: any = getHandler()
      handler.log('log message')
      xhrSpy.status = 404

      xhrSpy.readyState = XMLHttpRequest.HEADERS_RECEIVED
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.UNSENT
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.OPENED
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.LOADING
      xhrSpy.onreadystatechange({} as Event)

      expect(errorSpy).not.toHaveBeenCalled()
    })

    it('logs error if status is not 200 and request is done', () => {
      const handler: any = getHandler()

      handler.log('log message', {x: 'yz'})

      xhrSpy.status = 404
      xhrSpy.readyState = XMLHttpRequest.DONE
      xhrSpy.onreadystatechange({} as Event)

      expect(errorSpy).toHaveBeenCalledWith('XHR failed', xhrSpy)
      expect(errorSpy).toHaveBeenCalledWith('Log was not posted - ', 'log', ['log message', {x: 'yz'}])
    })

    it('logs an error if something fails', () => {
      const handler: any = getHandler()
      const error = new Error('send failed')
      xhrSpy.send.and.callFake(() => {
        throw error
      })

      handler.log('log message', {x: 'yz'})

      expect(errorSpy).toHaveBeenCalledWith('Error while trying to post log - ', error)
      expect(errorSpy).toHaveBeenCalledWith('Log was not posted - ', 'log', ['log message', {x: 'yz'}])
    })
  })

  describe('with options', () => {
    it('overrides the post route', () => {
      const route = '/my/route/for/logging'
      const handler = getHandler({httpPostRoute: route})

      handler.log('log message')

      expect(xhrSpy.open).toHaveBeenCalledWith(jasmine.anything(), route, jasmine.anything())
    })

    it('debug sends http request for all log levels', () => {
      const handler = getHandler({logLevel: NgLogLevel.debug})

      handler.debug('debug message')
      handler.info('info message')
      handler.log('log message')
      handler.warn('warn message')
      handler.error('error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(5)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"debug"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"info"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"log"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for info and up when loglevel is info', () => {
      const handler = getHandler({logLevel: NgLogLevel.info})

      handler.debug('debug message')
      handler.info('info message')
      handler.log('log message')
      handler.warn('warn message')
      handler.error('error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(4)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"info"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"log"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for log and up when loglevel is log', () => {
      const handler = getHandler({logLevel: NgLogLevel.log})

      handler.debug('debug message')
      handler.info('info message')
      handler.log('log message')
      handler.warn('warn message')
      handler.error('error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(3)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"log"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for warn and up when loglevel is warn', () => {
      const handler = getHandler({logLevel: NgLogLevel.warn})

      handler.debug('debug message')
      handler.info('info message')
      handler.log('log message')
      handler.warn('warn message')
      handler.error('error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(2)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"warn"`))
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })

    it('sends http request for only error messages when loglevel is error', () => {
      const handler = getHandler({logLevel: NgLogLevel.error})

      handler.debug('debug message')
      handler.info('info message')
      handler.log('log message')
      handler.warn('warn message')
      handler.error('error message')

      expect(xhrSpy.send).toHaveBeenCalledTimes(1)
      expect(xhrSpy.send).toHaveBeenCalledWith(jasmine.stringMatching(`{"logLevel":"error"`))
    })
  })

  for (const level in NgLogLevel) {
    const logLevel: string = NgLogLevel[level]
    if (typeof logLevel === 'string') {
      describe(`.${logLevel}`, () => {
        it(`formats the data correctly`, () => {
          const handler = getHandler()

          handler[logLevel](`${logLevel} log`)
          expect(xhrSpy.send).toHaveBeenCalledWith(`{"logLevel":"${logLevel}","params":["${logLevel} log"]}`)
          expect(xhrSpy.send).toHaveBeenCalledTimes(1)
        })

        it(`formats the errors correctly`, () => {
          const handler = getHandler()
          const error = new Error(`${logLevel} error`)

          handler[logLevel](error)

          const args = (<any>xhrSpy).send.calls.argsFor(0)
          const xhrSendPayload = JSON.parse(args[0])
          expect(xhrSendPayload).toEqual({logLevel: logLevel, params: [{message: error.message, stack: error.stack}]})
        })

        it('removes angular error properties from serialization', () => {
          const handler = getHandler()
          const error: any = new Error(`${logLevel} error`)
          error.ngDebugContext = 'context'
          error.ngErrorLogger = 'logger'
          error.DebugContext_ = 'other context'

          handler[logLevel](error)

          const args = (<any>xhrSpy).send.calls.argsFor(0)
          const xhrSendPayload = JSON.parse(args[0])
          expect(xhrSendPayload).toEqual({logLevel: logLevel, params: [{message: error.message, stack: error.stack}]})
        })

        it('does not post DebugContext_ objects', () => {
          const handler = getHandler()

          class DebugContext_ {
          }

          const context = new DebugContext_()

          handler[logLevel]('ERROR CONTEXT', context)

          const args = (<any>xhrSpy).send.calls.argsFor(0)
          const xhrSendPayload = JSON.parse(args[0])
          expect(xhrSendPayload).toEqual({logLevel: logLevel, params: ["ERROR CONTEXT", "[DebugContext_]"]})
        })

        it(`does not change the error property configurable descriptor`, () => {
          // this test is in here due to a previous implementation that would alter the Error object to get it to serialize properly.
          // However, the error object should not be altered for serialization purposes.

          const handler = getHandler()
          const error = new Error(`${logLevel} error`)

          handler[logLevel](error)

          const messageDescriptor = Object.getOwnPropertyDescriptor(error, 'message')
          const stackDescriptor = Object.getOwnPropertyDescriptor(error, 'stack')
          expect(messageDescriptor.enumerable).toBeFalsy()
          expect(stackDescriptor.enumerable).toBeFalsy()
        })

      })

    }
  }
})
