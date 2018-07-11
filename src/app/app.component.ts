import {Component} from '@angular/core'
import {NgLog} from 'nglog'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private nglog: NgLog) {
  }

  throwError() {
    throw new Error('uncaught exception, oh no!')
  }

  logError() {
    this.nglog.error(new Error('a logged message'))
  }

  logInfo() {
    this.nglog.info('some info')
  }

  logDebug() {
    this.nglog.debug('debugging message')
  }

  logWarn() {
    this.nglog.warn('will robinson!')
  }

  logLog() {
    this.nglog.log('log log')
  }
}
