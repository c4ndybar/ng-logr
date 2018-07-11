import {INgLogHandler} from './ng-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {INgLogOptions} from '../ng-log-options'

export class HttpLogHandler implements INgLogHandler {
  logLevel?: NgLogLevel

  constructor(options: INgLogOptions = {}) {
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
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'http://localhost:3201/logError', true)
      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
          } else {
            console.error('XHR failed', xhr)
            console.error('Log was not posted - ', NgLogLevel[level], ...params)
          }
        }
      }

      const data = {
        logLevel: NgLogLevel[level],
        params
      }

      xhr.send(JSON.stringify(data))
    } catch (err) {
      console.error('Error while trying to post log - ', err)
      console.error('Log was not posted - ', NgLogLevel[level], ...params)
    }
  }
}
