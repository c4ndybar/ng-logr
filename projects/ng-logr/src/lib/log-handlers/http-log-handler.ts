import {INgLogHandlerOptions, NgLogHandler} from './ng-log-handler'
import {NgLogLevel} from '../ng-log-level'
import {SerializerUtility} from '../util/serialize-utility'

export interface IHttpLogHandlerOptions extends INgLogHandlerOptions {
  httpPostRoute?: string
}

export class HttpLogHandler extends NgLogHandler {
  private httpPostRoute: string
  private XmlHttpRequest = XMLHttpRequest

  constructor(options: IHttpLogHandlerOptions = {}) {
    super(options)
    this.httpPostRoute = this.httpPostRoute || '/log'
  }

  async handleLog(level: NgLogLevel, ...params: any[]) {
    return new Promise<void>((resolve, reject) => {
      try {
        const httpRequest = new this.XmlHttpRequest()
        httpRequest.open('POST', this.httpPostRoute, true)
        httpRequest.setRequestHeader('Content-Type', 'application/json')

        httpRequest.onreadystatechange = function () {
          if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status !== 200) {
              console.debug('XHR failed', httpRequest)
              console.debug('Log was not posted - ', NgLogLevel[level], params)
              reject()
            } else {
              resolve()
            }
          }
        }

        const serialized = this.serializeXhrPayload(level, params)
        httpRequest.send(serialized)
      } catch (err) {
        console.debug('Error while trying to post log - ', err)
        console.debug('Log was not posted - ', NgLogLevel[level], params)
        reject(err)
      }
    })
  }

  private serializeXhrPayload(level: NgLogLevel, params: any) {
    const data = {
      logLevel: NgLogLevel[level],
      params
    }

    return SerializerUtility.stringify(data)
  }
}
