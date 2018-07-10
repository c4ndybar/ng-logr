import {TestBed} from '@angular/core/testing'
import {ErrorHandler} from '@angular/core'
import {NgLogErrorHandler} from './ng-log-error-handler.service'
import {NgLog} from './ng-log.service'


describe('NgLogErrorHandler', () => {
  let nglogSpy

  beforeEach(() => {
    nglogSpy = jasmine.createSpyObj('nglog', ['error'])
  })

  function getHandler(): ErrorHandler {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ErrorHandler,
          useClass: NgLogErrorHandler,
        },
        {
          provide: NgLog,
          useValue: nglogSpy
        }
      ],
    })

    return TestBed.get(ErrorHandler)
  }

  it('logs caught exceptions using nglog', () => {
    const handler = getHandler()
    const error = new Error('boom')

    handler.handleError(error)

    expect(nglogSpy.error).toHaveBeenCalledWith(error)
  })
})
