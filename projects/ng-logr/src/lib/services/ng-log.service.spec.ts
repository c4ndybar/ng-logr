import {TestBed} from '@angular/core/testing'
import {NgLog} from './ng-log.service'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from '../ng-log-options'
import {NgLogHandler} from '../log-handlers/ng-log-handler'
import {NgLogLevel} from '../ng-log-level'

describe('NgLog', () => {
  let service: NgLog
  let handlerSpy: NgLogHandler
  let otherHandlerSpy: NgLogHandler

  beforeEach(() => {
    handlerSpy = jasmine.createSpyObj('handler', ['handleLog'])
    otherHandlerSpy = jasmine.createSpyObj('otherHandler', ['handleLog'])
  })

  function getService(options: INgLogOptions): NgLog {
    TestBed.configureTestingModule({
      providers: [NgLog,
        {provide: NgLogOptions, useValue: options}
      ]
    })

    return TestBed.get(NgLog)
  }

  it('should be created', () => {
    expect(getService({})).toBeTruthy()
  })

  describe('calls the provided handler', () => {
    beforeEach(() => {
      const options = {
        logHandlers: [handlerSpy, otherHandlerSpy]
      }
      service = getService(options)
    })

    it('calls handler.log', (done) => {
      service.log('log message')
        .then(() => {
          expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.log, 'log message')
          expect(otherHandlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.log, 'log message')
        }).catch(fail).then(done)
    })

    it('calls handler.debug', (done) => {
      service.debug('debug message')
        .then(() => {
          expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.debug, 'debug message')
          expect(otherHandlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.debug, 'debug message')
        }).catch(fail).then(done)
    })

    it('calls handler.warn', (done) => {
      service.warn('warn message')
        .then(() => {
          expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.warn, 'warn message')
          expect(otherHandlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.warn, 'warn message')
        }).catch(fail).then(done)
    })

    it('calls handler.info', (done) => {
      service.info('info message')
        .then(() => {
          expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.info, 'info message')
          expect(otherHandlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.info, 'info message')
        }).catch(fail).then(done)
    })

    it('calls handler.error', (done) => {
      service.error('error message')
        .then(() => {
          expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.error, 'error message')
          expect(otherHandlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.error, 'error message')
        }).catch(fail).then(done)
    })

    it('calls handler.log with multiple params', (done) => {
      service.log('log message', 'and more log')
        .then(() => {
          expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.log, 'log message', 'and more log')
          expect(otherHandlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.log, 'log message', 'and more log')
        }).catch(fail).then(done)
    })

  })

  describe('calls the provided handler but limits by log level', () => {
    it('does not limit calls when handler has level debug', async (done) => {
      try {
        handlerSpy.logLevel = NgLogLevel.debug

        const options = {
          logHandlers: [handlerSpy]
        }

        service = getService(options)

        await service.debug('debug message')
        await service.info('info message')
        await service.log('log message')
        await service.warn('warn message')
        await service.error('error message')

        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.debug, 'debug message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.info, 'info message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.log, 'log message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.warn, 'warn message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.error, 'error message')
      } catch (ex) {
        fail(ex)
      } finally {
        done()
      }
    })

    it('limits calls if level is info', async (done) => {
      try {
        handlerSpy.logLevel = NgLogLevel.info

        const options = {
          logHandlers: [handlerSpy]
        }

        service = getService(options)

        await service.debug('debug message')
        await service.info('info message')
        await service.log('log message')
        await service.warn('warn message')
        await service.error('error message')

        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.debug, 'debug message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.info, 'info message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.log, 'log message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.warn, 'warn message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.error, 'error message')
      } catch (ex) {
        fail(ex)
      } finally {
        done()
      }
    })

    it('limits calls if level is log', async (done) => {
      try {
        handlerSpy.logLevel = NgLogLevel.log

        const options = {
          logHandlers: [handlerSpy]
        }

        service = getService(options)

        await service.debug('debug message')
        await service.info('info message')
        await service.log('log message')
        await service.warn('warn message')
        await service.error('error message')

        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.debug, 'debug message')
        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.info, 'info message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.log, 'log message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.warn, 'warn message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.error, 'error message')
      } catch (ex) {
        fail(ex)
      } finally {
        done()
      }
    })

    it('limits calls if level is warn', async (done) => {
      try {
        handlerSpy.logLevel = NgLogLevel.warn

        const options = {
          logHandlers: [handlerSpy]
        }

        service = getService(options)

        await service.debug('debug message')
        await service.info('info message')
        await service.log('log message')
        await service.warn('warn message')
        await service.error('error message')

        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.debug, 'debug message')
        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.info, 'info message')
        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.log, 'log message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.warn, 'warn message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.error, 'error message')
      } catch (ex) {
        fail(ex)
      } finally {
        done()
      }
    })

    it('limits calls if level is error', async (done) => {
      try {
        handlerSpy.logLevel = NgLogLevel.error

        const options = {
          logHandlers: [handlerSpy]
        }

        service = getService(options)

        await service.debug('debug message')
        await service.info('info message')
        await service.log('log message')
        await service.warn('warn message')
        await service.error('error message')

        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.debug, 'debug message')
        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.info, 'info message')
        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.log, 'log message')
        expect(handlerSpy.handleLog).not.toHaveBeenCalledWith(NgLogLevel.warn, 'warn message')
        expect(handlerSpy.handleLog).toHaveBeenCalledWith(NgLogLevel.error, 'error message')
      } catch (ex) {
        fail(ex)
      } finally {
        done()
      }
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

    it('sets the handler log level to the global log level if provided', () => {
      const options = {
        logLevel: NgLogLevel.warn,
        logHandlers: [handlerSpy]
      }

      service = getService(options)

      expect((<any>service).logHandlers[0].logLevel).toEqual(NgLogLevel.warn)
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
