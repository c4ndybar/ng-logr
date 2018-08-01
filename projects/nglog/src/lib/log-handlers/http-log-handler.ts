import {INgLogHandler, INgLogHandlerOptions} from './ng-log-handler'
import {NgLogLevel} from '../ng-log-level'
import stringify from 'fast-safe-stringify'

export interface IHttpLogHandlerOptions extends INgLogHandlerOptions {
  httpPostRoute?: string
}

export class HttpLogHandler implements INgLogHandler {
  logLevel?: NgLogLevel
  private httpPostRoute = '/log'
  private XmlHttpRequest = XMLHttpRequest

  constructor(options: IHttpLogHandlerOptions = {}) {
    Object.assign(<any>this, options)
  }

  debug(message?: any, ...params: any[]): void {
    this.postLog(NgLogLevel.debug, message, ...params)
  }

  error(message?: any, ...params: any[]): void {
    this.postLog(NgLogLevel.error, message, ...params)
  }

  info(message?: any, ...params: any[]): void {
    this.postLog(NgLogLevel.info, message, ...params)
  }

  log(message?: any, ...params: any[]): void {
    this.postLog(NgLogLevel.log, message, ...params)
  }

  warn(message?: any, ...params: any[]): void {
    this.postLog(NgLogLevel.warn, message, ...params)
  }

  private postLog(level: NgLogLevel, ...params: any[]) {
    if (level < this.logLevel) {
      return
    }

    try {
      const httpRequest = new this.XmlHttpRequest()
      httpRequest.open('POST', this.httpPostRoute, true)
      httpRequest.setRequestHeader('Content-Type', 'application/json')

      httpRequest.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status !== 200) {
            console.error('XHR failed', httpRequest)
            console.error('Log was not posted - ', NgLogLevel[level], params)
          }
        }
      }

      const serialized = this.serializeXhrPayload(level, params)
      httpRequest.send(serialized)
    } catch (err) {
      console.error('Error while trying to post log - ', err)
      console.error('Log was not posted - ', NgLogLevel[level], params)
    }
  }

  private serializeXhrPayload(level: NgLogLevel, params: any) {
    const data = {
      logLevel: NgLogLevel[level],
      params
    }

    return stringify(data, this.replacer)
  }

  private replacer(_key, value) {
    if (value instanceof Error) {
      const error = {}

      // we need to remove the angular properties from the error object because that can cause errors.
      // we also need to make the stack and message properties enumerable
      // this accomplishes both goals
      Object.getOwnPropertyNames(value).forEach(function (key) {
        if (!['ngDebugContext', 'ngErrorLogger', 'DebugContext_'].includes(key)) {
          error[key] = value[key]
        }
      })
      value = error
    } else if (value.constructor.name === 'DebugContext_') {
      value = '[DebugContext_]'
    }

    return value
  }
}
