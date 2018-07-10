import {Inject, Injectable} from '@angular/core'
import {NgLogLevel} from './ng-log-level'
import {defaultNgLogOptions, INgLogOptions, NgLogOptions} from './ng-log-options'

export interface INgLog {
  readonly options: INgLogOptions

  log(message: any): void

  error(message: any): void

  info(message: any): void

  warn(message: any): void

  debug(message: any): void
}

@Injectable({providedIn: 'root'})
export class NgLog implements INgLog {

  constructor(@Inject(NgLogOptions) public readonly options: INgLogOptions) {
    if (!this.options) {
      this.options = defaultNgLogOptions
    }
  }

  debug(message: any): void {
    if (this.options.logLevel === NgLogLevel.debug) {
      console.debug(message)
    }
  }

  info(message: any): void {
    if (this.options.logLevel <= NgLogLevel.info) {
      console.info(message)
    }
  }

  log(message: any): void {
    if (this.options.logLevel <= NgLogLevel.log) {
      console.log(message)
    }
  }

  warn(message: any): void {
    if (this.options.logLevel <= NgLogLevel.warn) {
      console.warn(message)
    }
  }

  error(message: any) {
    console.error(message)
  }
}
