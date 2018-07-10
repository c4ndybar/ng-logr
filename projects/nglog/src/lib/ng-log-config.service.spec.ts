import {TestBed} from '@angular/core/testing'

import {NgLogConfig} from './ng-log-config.service'
import {INgLogOptions, NgLogOptions} from './ng-log-options'
import {NgLogLevel} from './ng-log-level'

describe('NgLogConfigService', () => {
  function getService(options: INgLogOptions = {}) {
    TestBed.configureTestingModule({
      providers: [{provide: NgLogOptions, useValue: options}]
    })

    return TestBed.get(NgLogConfig)
  }

  it('should be created', () => {
    expect(getService()).toBeTruthy()
  })

  it('uses default options if provided config does not provide values', () => {
    const config: INgLogOptions = getService()

    expect(config.logLevel).toEqual(NgLogLevel.debug)
  })

  it('overrides default log level', () => {
    const config: INgLogOptions = getService({logLevel: NgLogLevel.error})

    expect(config.logLevel).toEqual(NgLogLevel.error)
  })

  it('uses defaults if options are undefined', () => {
    const config: INgLogOptions = getService(undefined)

    expect(config.logLevel).toEqual(NgLogLevel.debug)
  })

})
