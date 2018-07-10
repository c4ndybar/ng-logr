import {TestBed} from '@angular/core/testing'
import {INgLog, NgLog} from './ng-log.service'
import {NgLogLevel} from './ng-log-level'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from './ng-log-options'
import {NgLogConfig} from './ng-log-config.service'

describe('NgLog', () => {
  let service: INgLog
  let logSpy, warnSpy, infoSpy, debugSpy, errorSpy

  beforeEach(() => {
    logSpy = spyOn(console, 'log')
    warnSpy = spyOn(console, 'warn')
    infoSpy = spyOn(console, 'info')
    debugSpy = spyOn(console, 'debug')
    errorSpy = spyOn(console, 'error')
  })

  function getService(options: INgLogOptions): NgLog {
    TestBed.configureTestingModule({
      providers: [NgLog,
        {provide: NgLogConfig, useValue: options}
      ]
    })

    return TestBed.get(NgLog)
  }

  describe('with default options', () => {
    beforeEach(() => {
      service = getService(defaultNgLogOptions)
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('calls console.log', () => {
      service.log('log message')

      expect(logSpy).toHaveBeenCalledWith('log message')
    })

    it('calls console.debug', () => {
      service.debug('debug message')

      expect(debugSpy).toHaveBeenCalledWith('debug message')
    })

    it('calls console.warn', () => {
      service.warn('warn message')

      expect(warnSpy).toHaveBeenCalledWith('warn message')
    })

    it('calls console.info', () => {
      service.info('info message')

      expect(infoSpy).toHaveBeenCalledWith('info message')
    })

    it('calls console.error', () => {
      service.error('error message')

      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('calls console.log with multiple params', () => {
      service.log('log message', 'and more log')

      expect(logSpy).toHaveBeenCalledWith('log message', 'and more log')
    })

    it('calls console.debug with multiple params', () => {
      service.debug('debug message', 'and more debug')

      expect(debugSpy).toHaveBeenCalledWith('debug message', 'and more debug')
    })

    it('calls console.warn with multiple params', () => {
      service.warn('warn message', 'and more warn')

      expect(warnSpy).toHaveBeenCalledWith('warn message', 'and more warn')
    })

    it('calls console.info with multiple params', () => {
      service.info('info message', 'and more info')

      expect(infoSpy).toHaveBeenCalledWith('info message', 'and more info')
    })

    it('calls console.error with multiple params', () => {
      service.error('error message', 'and more error')

      expect(errorSpy).toHaveBeenCalledWith('error message', 'and more error')
    })
  })

  describe('with options', () => {
    it('debug allows everything', () => {
      service = getService({logLevel: NgLogLevel.debug})

      service.debug('debug message')
      service.info('info message')
      service.log('log message')
      service.warn('warn message')
      service.error('error message')

      expect(debugSpy).toHaveBeenCalledWith('debug message')
      expect(infoSpy).toHaveBeenCalledWith('info message')
      expect(logSpy).toHaveBeenCalledWith('log message')
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows info and up when loglevel is info', () => {
      service = getService({logLevel: NgLogLevel.info})

      service.debug('debug message')
      service.info('info message')
      service.log('log message')
      service.warn('warn message')
      service.error('error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).toHaveBeenCalledWith('info message')
      expect(logSpy).toHaveBeenCalledWith('log message')
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows log and up when loglevel is log', () => {
      service = getService({logLevel: NgLogLevel.log})

      service.debug('debug message')
      service.info('info message')
      service.log('log message')
      service.warn('warn message')
      service.error('error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).not.toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith('log message')
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows warn and up when loglevel is warn', () => {
      service = getService({logLevel: NgLogLevel.warn})

      service.debug('debug message')
      service.info('info message')
      service.log('log message')
      service.warn('warn message')
      service.error('error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).not.toHaveBeenCalled()
      expect(logSpy).not.toHaveBeenCalled()
      expect(warnSpy).toHaveBeenCalledWith('warn message')
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })

    it('shows only error messages when loglevel is error', () => {
      service = getService({logLevel: NgLogLevel.error})

      service.debug('debug message')
      service.info('info message')
      service.log('log message')
      service.warn('warn message')
      service.error('error message')

      expect(debugSpy).not.toHaveBeenCalled()
      expect(infoSpy).not.toHaveBeenCalled()
      expect(logSpy).not.toHaveBeenCalled()
      expect(warnSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalledWith('error message')
    })
  })
})
