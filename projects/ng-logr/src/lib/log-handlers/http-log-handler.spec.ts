import {HttpLogHandler} from './http-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {NgLogHandler} from './ng-log-handler'

describe('HttpLogHandler', () => {
  let xhrSpy

  beforeEach(() => {
    xhrSpy = jasmine.createSpyObj('xhr', ['send', 'open', 'setRequestHeader', 'onreadystatechange'])
  })

  function getHandler(options = {}): NgLogHandler {
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

  describe('serialization', () => {
    it(`formats the data correctly`, () => {
      const handler = getHandler()

      handler.handleLog(NgLogLevel.log, 'log')

      expect(xhrSpy.send).toHaveBeenCalledWith(`{"logLevel":"log","params":["log"]}`)
      expect(xhrSpy.send).toHaveBeenCalledTimes(1)
    })
  })

  describe('handling response', () => {
    let debugSpy

    beforeEach(() => {
      debugSpy = spyOn(console, 'debug')

    })

    it('ignores ready states except for done', (done) => {
      getHandler().handleLog(NgLogLevel.log, 'log message')
        .then(fail)
        .catch(() => {
          expect(xhrSpy.readyState).toEqual(XMLHttpRequest.DONE)
        }).then(done)

      xhrSpy.status = 404

      xhrSpy.readyState = XMLHttpRequest.HEADERS_RECEIVED
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.UNSENT
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.OPENED
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.LOADING
      xhrSpy.onreadystatechange({} as Event)

      xhrSpy.readyState = XMLHttpRequest.DONE
      xhrSpy.onreadystatechange({} as Event)
    })

    it('logs error if status is not 200 and request is done', (done) => {
      getHandler().handleLog(NgLogLevel.log, 'log message', {x: 'yz'})
        .then(fail)
        .catch(() => {
          expect(debugSpy).toHaveBeenCalledWith('XHR failed', xhrSpy)
          expect(debugSpy).toHaveBeenCalledWith('Log was not posted - ', 'log', ['log message', {x: 'yz'}])
        }).then(done)

      xhrSpy.status = 404
      xhrSpy.readyState = XMLHttpRequest.DONE
      xhrSpy.onreadystatechange({} as Event)
    })

    it('returns if success', (done) => {
      getHandler().handleLog(NgLogLevel.log, 'log message', {x: 'yz'})
        .then(() => {
          expect(debugSpy).not.toHaveBeenCalled()
          expect(debugSpy).not.toHaveBeenCalled()
        }).catch(fail).then(done)

      xhrSpy.status = 200
      xhrSpy.readyState = XMLHttpRequest.DONE
      xhrSpy.onreadystatechange({} as Event)
    })

    it('logs a debug message if something fails', (done) => {
      const error = new Error('send failed')
      xhrSpy.send.and.callFake(() => {
        throw error
      })

      getHandler().handleLog(NgLogLevel.log, 'log message', {x: 'yz'})
        .then(fail)
        .catch((err) => {
          expect(debugSpy).toHaveBeenCalledWith('Error while trying to post log - ', error)
          expect(debugSpy).toHaveBeenCalledWith('Log was not posted - ', 'log', ['log message', {x: 'yz'}])

          expect(err).toBe(error)
        }).then(done)
    })
  })

  describe('with options', () => {
    it('overrides the post route', () => {
      const route = '/my/route/for/logging'
      const handler = getHandler({httpPostRoute: route})

      handler.handleLog(NgLogLevel.log, 'log message')

      expect(xhrSpy.open).toHaveBeenCalledWith(jasmine.anything(), route, jasmine.anything())
    })
  })

})
