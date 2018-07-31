import {TestBed} from '@angular/core/testing'
import {INgLog, NgLog} from './ng-log.service'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from '../ng-log-options'
import {INgLogHandler} from '../log-handlers/ng-log-handler'
import {NgLogLevel} from '../ng-log-level'

describe('NgLog', () => {
  let service: INgLog
  let handlerSpy: INgLogHandler
  let otherHandlerSpy: INgLogHandler

  beforeEach(() => {
    handlerSpy = jasmine.createSpyObj('handler', ['debug', 'info', 'log', 'warn', 'error'])
    otherHandlerSpy = jasmine.createSpyObj('otherHandler', ['debug', 'info', 'log', 'warn', 'error'])
  })

  function getService(options: INgLogOptions): NgLog {
    TestBed.configureTestingModule({
      providers: [NgLog,
        {provide: NgLogOptions, useValue: options}
      ]
    })

    return TestBed.get(NgLog)
  }

  describe('calls the provided handler', () => {
    beforeEach(() => {
      const options = {
        logHandlers: [handlerSpy, otherHandlerSpy]
      }
      service = getService(options)
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('calls handler.log', () => {
      service.log('log message')

      expect(handlerSpy.log).toHaveBeenCalledWith('log message')
      expect(otherHandlerSpy.log).toHaveBeenCalledWith('log message')
    })

    it('calls handler.debug', () => {
      service.debug('debug message')

      expect(handlerSpy.debug).toHaveBeenCalledWith('debug message')
      expect(otherHandlerSpy.debug).toHaveBeenCalledWith('debug message')
    })

    it('calls handler.warn', () => {
      service.warn('warn message')

      expect(handlerSpy.warn).toHaveBeenCalledWith('warn message')
      expect(otherHandlerSpy.warn).toHaveBeenCalledWith('warn message')
    })

    it('calls handler.info', () => {
      service.info('info message')

      expect(handlerSpy.info).toHaveBeenCalledWith('info message')
      expect(otherHandlerSpy.info).toHaveBeenCalledWith('info message')
    })

    it('calls handler.error', () => {
      service.error('error message')

      expect(handlerSpy.error).toHaveBeenCalledWith('error message')
      expect(otherHandlerSpy.error).toHaveBeenCalledWith('error message')
    })

    it('calls handler.log with multiple params', () => {
      service.log('log message', 'and more log')

      expect(handlerSpy.log).toHaveBeenCalledWith('log message', 'and more log')
      expect(otherHandlerSpy.log).toHaveBeenCalledWith('log message', 'and more log')
    })

    it('calls handler.debug with multiple params', () => {
      service.debug('debug message', 'and more debug')

      expect(handlerSpy.debug).toHaveBeenCalledWith('debug message', 'and more debug')
      expect(otherHandlerSpy.debug).toHaveBeenCalledWith('debug message', 'and more debug')
    })

    it('calls handler.warn with multiple params', () => {
      service.warn('warn message', 'and more warn')

      expect(handlerSpy.warn).toHaveBeenCalledWith('warn message', 'and more warn')
      expect(otherHandlerSpy.warn).toHaveBeenCalledWith('warn message', 'and more warn')
    })

    it('calls handler.info with multiple params', () => {
      service.info('info message', 'and more info')

      expect(handlerSpy.info).toHaveBeenCalledWith('info message', 'and more info')
      expect(otherHandlerSpy.info).toHaveBeenCalledWith('info message', 'and more info')
    })

    it('calls handler.error with multiple params', () => {
      service.error('error message', 'and more error')

      expect(handlerSpy.error).toHaveBeenCalledWith('error message', 'and more error')
      expect(otherHandlerSpy.error).toHaveBeenCalledWith('error message', 'and more error')
    })
  })

  describe('options', () => {
    it('sets the handler log level to default if no level is provided', () => {
      const options = {
        logHandlers: [handlerSpy]
      }

      service = getService(options)

      expect((<any>service).logHandlers[0].logLevel).toEqual(defaultNgLogOptions.logLevel)
    })

    it('uses the handler log level if it is provided', () => {
      handlerSpy.logLevel = NgLogLevel.error

      const options = {
        logHandlers: [handlerSpy]
      }

      service = getService(options)

      expect((<any>service).logHandlers[0].logLevel).toEqual(NgLogLevel.error)
    })

    it('uses the default log handlers if no handlers are provided', () => {
      const options = {
        logLevel: NgLogLevel.error
      }

      service = getService(options)

      expect((<any>service).logHandlers).toEqual(defaultNgLogOptions.logHandlers)
    })
  })
})
