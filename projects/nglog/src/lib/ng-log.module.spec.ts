import {TestBed} from '@angular/core/testing'
import {NgLogModule} from './ng-log.module'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from './ng-log-options'
import {NgLogLevel} from './ng-log-level'
import {NgLogErrorHandler} from './ng-log-error-handler.service'
import {ErrorHandler} from '@angular/core'

describe('ng-log.module', () => {
  it('sets default NgLogOptions when none are provided', () => {
    TestBed.configureTestingModule({
      imports: [
        NgLogModule
      ]
    })

    const options = TestBed.get(NgLogOptions)

    expect(options).toEqual(defaultNgLogOptions)
  })

  it('allows for the configuration to be overridden', () => {
    const options: INgLogOptions = {
      logLevel: NgLogLevel.error
    }

    TestBed.configureTestingModule({
      imports: [
        NgLogModule
      ],
      providers: [{provide: NgLogOptions, useValue: options}]
    })

    const actualOptions = TestBed.get(NgLogOptions)

    expect(actualOptions).toEqual(options)
  })

  it('provides the error handler', () => {
    TestBed.configureTestingModule({
      imports: [
        NgLogModule
      ],
    })

    const handler = TestBed.get(ErrorHandler)

    expect(handler).toBeDefined()
    expect(handler).toEqual(jasmine.any(NgLogErrorHandler))
  })

})
