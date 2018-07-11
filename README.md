# Nglog

Angular logger that is designed to be simple and configurable.  Ships with the following features.
- Two log handlers are provided.
  - ConsoleLogHandlder (enabled by default) - Prints logs to the console
  - HttpLogHandler - Posts logs to an http endpoint.
- Uncaught exception handling
  - Provides an exception handler by default that extends Angular's built in ErrorHandler but uses NgLog to log the errors.
- Cascading configuration.
- Ability to provide new log handlers or extend existing ones.

## Quick Start
install the library

`npm install --save nglog`

Import `NgLogModule` into your apps root module.
```typescript
import {NgModule} from '@angular/core'
import {NgLogModule} from 'nglog'

@NgModule({
  imports: [
    NgLogModule,
  ],
})
export class AppModule {
}
```

Use it in your app to log stuff

```typescript
import {Injectable} from '@angular/core'
import {NgLog} from 'nglog'

@Injectable({ providedIn: 'root' })
export class ErrorService {

  constructor(private nglog: NgLog) { }

  log() {
    this.nglog.log('my first nglog')
  }
}
```

The NgLog interface is simple and provides only 5 logging methods.

```typescript
interface INgLog {
  debug(message?: any, ...params: any[]): void
  info(message?: any, ...params: any[]): void
  log(message?: any, ...params: any[]): void
  warn(message?: any, ...params: any[]): void
  error(message?: any, ...params: any[]): void
}
```

## Configuration

This is the default configuration.

```typescript
{
  logLevel: NgLogLevel.debug,
  logProviders: [new ConsoleLogProvider()]
}
```

To override the configuration, provide `NgLogOptions` when declaring your root module.

```typescript
import {NgModule} from '@angular/core'
import {INgLogOptions, NgLogLevel, NgLogModule, NgLogOptions,} from 'nglog'
import {ConsoleLogHandler} from 'nglog'

const options: INgLogOptions = {
  logLevel: NgLogLevel.debug,
  logHandlers: [new ConsoleLogHandler()]
}

@NgModule({
  imports: [
    NgLogModule,
  ],
  providers: [{provide: NgLogOptions, useValue: options}]
})
export class AppModule {
}
```

