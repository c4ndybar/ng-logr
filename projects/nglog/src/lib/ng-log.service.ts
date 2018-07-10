import {Injectable} from '@angular/core'
import {NgLogLevel} from './ng-log-level'
import {NgLogConfig} from './ng-log-config.service'

export interface INgLog {
  debug(message?: any, ...params: any[]): void
  info(message?: any, ...params: any[]): void
  log(message?: any, ...params: any[]): void
  warn(message?: any, ...params: any[]): void
  error(message?: any, ...params: any[]): void
}

@Injectable({providedIn: 'root'})
export class NgLog implements INgLog {

  constructor(private ngLogConfig: NgLogConfig) {
  }

  debug(message?: any, ...params: any[]): void {
    if (this.ngLogConfig.logLevel === NgLogLevel.debug) {
      console.debug(message, ...params)
    }
  }

  info(message?: any, ...params: any[]): void {
    if (this.ngLogConfig.logLevel <= NgLogLevel.info) {
      console.info(message, ...params)
    }
  }

  log(message?: any, ...params: any[]): void {
    if (this.ngLogConfig.logLevel <= NgLogLevel.log) {
      console.log(message, ...params)
    }
  }

  warn(message?: any, ...params: any[]): void {
    if (this.ngLogConfig.logLevel <= NgLogLevel.warn) {
      console.warn(message, ...params)
    }
  }

  error(message?: any, ...params: any[]) {
    console.error(message, ...params)
  }
}
