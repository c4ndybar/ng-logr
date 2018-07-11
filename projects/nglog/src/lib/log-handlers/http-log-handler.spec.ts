import {HttpLogHandler} from './http-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {isNumber} from 'util'

describe('HttpLogHandler', () => {
  let xhrSpy: XMLHttpRequest

  beforeEach(() => {
    xhrSpy = jasmine.createSpyObj('xhr', ['send', 'open', 'setRequestHeader'])
    spyOn(<any>window, 'XMLHttpRequest').and.returnValue(xhrSpy)
  })

  it('has log level that is undefined by default', () => {
    expect((new HttpLogHandler()).logLevel).toBeUndefined()
  })

  it('sets the log level if it is provided', () => {
    const handler = new HttpLogHandler({logLevel: NgLogLevel.info})

    expect(handler.logLevel).toEqual(NgLogLevel.info)
  })

  it('attempts to post a log', () => {
    const handler = new HttpLogHandler()

    handler.log('should post')

    expect(xhrSpy.send).toHaveBeenCalled()
  })

  for (const level in NgLogLevel) {
    const logLevel: string = NgLogLevel[level]
    if (typeof logLevel === 'string') {

      it(`formats the data correctly for ${logLevel}`, () => {
        const handler = new HttpLogHandler()

        handler[logLevel](`${logLevel} log`)

        expect(xhrSpy.send).toHaveBeenCalledWith(`{"logLevel":"${logLevel}","params":["${logLevel} log"]}`)
      })
    }
  }
})
