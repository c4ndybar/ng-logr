
# Nglog
**Currently in Beta**

Angular logger that is designed to be simple and configurable.  Ships with the following features.
- Two log handlers are provided.
  - ConsoleLogHandlder (enabled by default) - Prints logs to the console
  - HttpLogHandler - Posts logs to an http endpoint.  Handles circular references and removes Angular debugging objects.
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
export class MyService {

  constructor(nglog: NgLog) { 
    nglog.log('I made a log!')
  }
}
```

The NgLog interface is simple and provides only 5 logging methods.

```typescript
interface NgLog {
  debug(message?: any, ...params: any[]): void
  info(message?: any, ...params: any[]): void
  log(message?: any, ...params: any[]): void
  warn(message?: any, ...params: any[]): void
  error(message?: any, ...params: any[]): void
}
```

## Configuration

The default configuration for NgLog is below.  The default global log level is `debug` and the only log handler is the `ConsoleLogHandler`, which logs to the console.

```typescript
{
  logLevel: NgLogLevel.debug,
  logHandlers: [new ConsoleLogHandler()]
}
```

To override the configuration, provide `NgLogOptions` when declaring your root module.

```typescript
import {NgModule} from '@angular/core'
import {INgLogOptions, NgLogLevel, NgLogModule, NgLogOptions,} from 'nglog'
import {ConsoleLogHandler} from 'nglog'

const options: INgLogOptions = {
  logLevel: NgLogLevel.error,
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

## Use Cases

#### How can I send logs to the server?

Include the `HttpLogHandler` when defining your log handlers in your configuration options.  This log handler posts logs to your sever at the endpoint `/log`.  You can override the log post route by defining the option `postHttpRoute` as shown in the example below.
```typescript
import {ConsoleLogHandler, HttpLogHandler} from 'nglog'

const httpHandler = new HttpLogHandler({
  postHttpRoute: 'serverLogRoute'
})
const options: INgLogOptions = {
  logHandlers: [new ConsoleLogHandler(), httpHandler]
}
```
#### How can I restrict the log level

The default log level for NgLog is `debug`.  You can override this globally by providing the option `logLevel` in the `NgLogOptions`.  You can also provide the `logLevel` option to a handler to override the log level for that particular handler.
```typescript
import {ConsoleLogHandler, HttpLogHandler} from 'nglog'

const httpHandler = new HttpLogHandler({
  logLevel: NgLogLevel.error
})
const options: INgLogOptions = {
  logLevel: NgLogLevel.debug,
  logHandlers: [new ConsoleLogHandler(), httpHandler]
}
```
