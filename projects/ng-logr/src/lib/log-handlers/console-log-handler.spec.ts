import {ConsoleLogHandler} from './console-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {NgLogHandler} from './ng-log-handler'
import {defaultNgLogOptions, INgLogOptions} from '../ng-log-options'

describe('ConsoleLogHandler', () => {
  let handler: NgLogHandler
  let logSpy, warnSpy, infoSpy, debugSpy, errorSpy

  beforeEach(() => {
    logSpy = spyOn(console, 'log')
    warnSpy = spyOn(console, 'warn')
    infoSpy = spyOn(console, 'info')
    debugSpy = spyOn(console, 'debug')
    errorSpy = spyOn(console, 'error')
  })

  function getHandler(options: INgLogOptions): NgLogHandler {
    return new ConsoleLogHandler(options)
  }

  it('has log level that is undefined by default', () => {
    expect((new ConsoleLogHandler()).logLevel).toBeUndefined()
  })

  it('sets the log level if it is provided', () => {
    handler = new ConsoleLogHandler({logLevel: NgLogLevel.info})

    expect(handler.logLevel).toEqual(NgLogLevel.info)
  })

  describe('with default options', () => {
    beforeEach(() => {
      handler = getHandler(defaultNgLogOptions)
    })

    it('should be created', () => {
      expect(handler).toBeTruthy()
    })

    it('calls console.log', (done) => {
      handler.handleLog(NgLogLevel.log, 'log message')
        .then(() => {
          expect(logSpy).toHaveBeenCalledWith('log message')
        })
        .catch(fail)
        .then(done)
    })

    it('calls console.debug', (done) => {
      handler.handleLog(NgLogLevel.debug, 'debug message')
        .then(() => {
          expect(debugSpy).toHaveBeenCalledWith('debug message')
        })
        .catch(fail)
        .then(done)

    })

    it('calls console.warn', (done) => {
      handler.handleLog(NgLogLevel.warn, 'warn message')
        .then(() => {
          expect(warnSpy).toHaveBeenCalledWith('warn message')
        })
        .catch(fail)
        .then(done)
    })

    it('calls console.info', (done) => {
      handler.handleLog(NgLogLevel.info, 'info message')
        .then(() => {
          expect(infoSpy).toHaveBeenCalledWith('info message')
        })
        .catch(fail)
        .then(done)
    })

    it('calls console.error', (done) => {
      handler.handleLog(NgLogLevel.error, 'error message')
        .then(() => {
          expect(errorSpy).toHaveBeenCalledWith('error message')
        })
        .catch(fail)
        .then(done)
    })

    it('calls console.log with multiple params', (done) => {
      handler.handleLog(NgLogLevel.log, 'log message', 'and more log')
        .then(() => {
          expect(logSpy).toHaveBeenCalledWith('log message', 'and more log')
        })
        .catch(fail)
        .then(done)
    })

  })
})
