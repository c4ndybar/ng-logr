import {INgLog} from '../ng-log.service'
import {NgLogLevel} from '../ng-log-level'

export interface INgLogHandlerOptions {
  logLevel?: NgLogLevel
}

export const defaultNgLogHandlerOptions: INgLogHandlerOptions = {
  logLevel: NgLogLevel.debug,
}

export interface INgLogHandler extends INgLog, INgLogHandlerOptions {
}
