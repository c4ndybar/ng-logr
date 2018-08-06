import {ConsoleLogHandler} from './console-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {INgLogHandler} from './ng-log-handler'
import {defaultNgLogOptions, INgLogOptions} from '../ng-log-options'

describe('ConsoleLogHandler', () => {
  let handler: INgLogHandler
  let logSpy, warnSpy, infoSpy, debugSpy, errorSpy

  beforeEach(() => {
    logSpy = spyOn(console, 'log')
    warnSpy = spyOn(console, 'warn')
    infoSpy = spyOn(console, 'info')
    debugSpy = spyOn(console, 'debug')
    errorSpy = spyOn(console, 'error')
  })

  function getHandler(options: INgLogOptions): INgLogHandler {
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

  describe('with options', () => {
    it('debug allows everything', () => {
      handler = getHandler({logLevel: NgLogLevel.debug})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(debugSpy).toHaveBeenCalledWith('debug message')
      expect(infoSpy).toHaveBeenCalledWith('info message')
      expect(logSpy).toHaveBeenCalledWith('log message')
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows info and up when loglevel is info', () => {
      handler = getHandler({logLevel: NgLogLevel.info})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).toHaveBeenCalledWith('info message')
      expect(logSpy).toHaveBeenCalledWith('log message')
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows log and up when loglevel is log', () => {
      handler = getHandler({logLevel: NgLogLevel.log})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).not.toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith('log message')
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows warn and up when loglevel is warn', () => {
      handler = getHandler({logLevel: NgLogLevel.warn})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).not.toHaveBeenCalled()
      expect(logSpy).not.toHaveBeenCalled()
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows only error messages when loglevel is error', () => {
      handler = getHandler({logLevel: NgLogLevel.error})

      handler.handleLog(NgLogLevel.debug, 'debug message')
      handler.handleLog(NgLogLevel.info, 'info message')
      handler.handleLog(NgLogLevel.log, 'log message')
      handler.handleLog(NgLogLevel.warn, 'warn message')
      handler.handleLog(NgLogLevel.error, 'error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).not.toHaveBeenCalled()
      expect(logSpy).not.toHaveBeenCalled()
      expect(warnSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })
  })
})
