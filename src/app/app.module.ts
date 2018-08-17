import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {AppComponent} from './app.component'
import {SerializerUtility, ConsoleLogHandler, INgLogOptions, NgLogHandler, NgLogLevel, NgLogModule, NgLogOptions} from 'ng-logr'
import iziToast from 'izitoast'

class TimestampConsoleLogHandler extends ConsoleLogHandler {
  handleLog(level: NgLogLevel, ...params: any[]) {
    super.handleLog(level, (new Date()).toLocaleString(), ...params)
  }
}

class ToastLogHandler extends NgLogHandler {
  handleLog(level: NgLogLevel, ...params: any[]) {
    iziToast.show({
      title: NgLogLevel[level] + ' message',
      message: SerializerUtility.stringify(params)
    })
  }
}

const options: INgLogOptions = {
  logLevel: NgLogLevel.error,
  logHandlers: [
    new TimestampConsoleLogHandler(),
    new ToastLogHandler()
  ]
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgLogModule,
  ],
  providers: [{provide: NgLogOptions, useValue: options}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
