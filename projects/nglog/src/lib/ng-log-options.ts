import {NgLogLevel} from './ng-log-level'
import {InjectionToken} from '@angular/core'
import {INgLogConfig} from './ng-log-config.service'

export type INgLogOptions = Partial<INgLogConfig>

export const defaultNgLogOptions: INgLogOptions = {
  logLevel: NgLogLevel.debug
}
export const NgLogOptions = new InjectionToken<INgLogOptions>('INgLogOptions injection token')
