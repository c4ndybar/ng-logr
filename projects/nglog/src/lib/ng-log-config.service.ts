import {Inject, Injectable} from '@angular/core'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from './ng-log-options'
import {NgLogLevel} from './ng-log-level'

export interface INgLogConfig {
  logLevel: NgLogLevel
}

@Injectable({
  providedIn: 'root'
})
export class NgLogConfig implements INgLogConfig {
  logLevel: NgLogLevel

  public constructor(@Inject(NgLogOptions) private readonly options: INgLogOptions) {
    Object.assign(<NgLogConfig>this, defaultNgLogOptions, options)
  }
}
