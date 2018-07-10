import {NgLogLevel} from './ng-log-level'
import {InjectionToken} from '@angular/core'

export interface INgLogOptions {
  logLevel: NgLogLevel
}

export const defaultNgLogOptions: INgLogOptions = {
  logLevel: NgLogLevel.debug
}
export const NgLogOptions = new InjectionToken<INgLogOptions>('INgLogOptions injection token')
