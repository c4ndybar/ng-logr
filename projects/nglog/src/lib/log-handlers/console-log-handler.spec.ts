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

    it('calls console.log', () => {
      handler.handleLog(NgLogLevel.log, 'log message')

      expect(logSpy).toHaveBeenCalledWith('log message')
    })

    it('calls console.debug', () => {
      handler.handleLog(NgLogLevel.debug, 'debug message')

      expect(debugSpy).toHaveBeenCalledWith('debug message')
    })

    it('calls console.warn', () => {
      handler.handleLog(NgLogLevel.warn, 'warn message')

      expect(warnSpy).toHaveBeenCalledWith('warn message')
    })

    it('calls console.info', () => {
      handler.handleLog(NgLogLevel.info, 'info message')

      expect(infoSpy).toHaveBeenCalledWith('info message')
    })

    it('calls console.error', () => {
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('calls console.log with multiple params', () => {
      handler.handleLog(NgLogLevel.log, 'log message', 'and more log')

      expect(logSpy).toHaveBeenCalledWith('log message', 'and more log')
    })

  })
})
