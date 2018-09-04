import {SerializerUtility} from './serialize-utility'

describe('serialize-utility', () => {
  it('handles null', () => {
    const foo: any = {nil: null}

    const json = SerializerUtility.stringify(foo)
    const obj = JSON.parse(json)

    expect(obj).toEqual(foo)
  })

  it('serializes circular references appropriately', () => {
    const foo: any = {someVal: 5}
    const bar: any = {nestedObj: foo}
    foo.circularRef = bar

    const json = SerializerUtility.stringify(bar)
    const obj = JSON.parse(json)

    expect(obj).toEqual({
      nestedObj: {someVal: 5, circularRef: '[Circular]'}
    })
  })

  it('handles infinite circular ref', () => {
    const foo: any = {}
    foo.anotherFoo = foo

    const json = SerializerUtility.stringify(foo)
    const obj = JSON.parse(json)

    expect(obj).toEqual({
      anotherFoo: '[Circular]'
    })
  })

  it('does not incorrectly identify repeated value references as ciruclar references', () => {
    const bar: any = {one: 1, anotherOne: 1}

    const json = SerializerUtility.stringify(bar)
    const obj = JSON.parse(json)

    expect(obj).toEqual(bar)
  })

  it('does not incorrectly identify repeated object references as ciruclar references', () => {
    const foo = {}
    const bar: any = {foo: foo, anotherFoo: foo}

    const json = SerializerUtility.stringify(bar)
    const obj = JSON.parse(json)

    expect(obj).toEqual(bar)
  })

  it(`formats the errors correctly`, () => {
    const error = new Error(`log error`)

    const json = SerializerUtility.stringify(error)
    const obj = JSON.parse(json)

    expect(obj).toEqual({
      message: error.message,
      stack: error.stack
    })
  })

  it('removes angular error properties from serialization', () => {
    const error: any = new Error(`log error`)
    error.ngDebugContext = 'context'
    error.ngErrorLogger = 'logger'
    error.DebugContext_ = 'other context'

    const json = SerializerUtility.stringify(error)
    const obj = JSON.parse(json)

    expect(obj).toEqual({
      message: error.message,
      stack: error.stack
    })
  })

  it('does not serialize DebugContext_ objects', () => {
    // tslint:disable-next-line
    class DebugContext_ {
    }

    const context = new DebugContext_()

    const json = SerializerUtility.stringify(context)
    const obj = JSON.parse(json)

    expect(obj).toEqual('[DebugContext_]')
  })

  it(`does not change the error property configurable descriptor`, () => {
    // this test is in here due to a previous implementation that would alter the Error object to get it to serialize properly.
    // However, the error object should not be altered for serialization purposes.

    const error = new Error(`log error`)

    SerializerUtility.stringify(error)

    const messageDescriptor = Object.getOwnPropertyDescriptor(error, 'message')
    const stackDescriptor = Object.getOwnPropertyDescriptor(error, 'stack')
    expect(messageDescriptor.enumerable).toBeFalsy()
    expect(stackDescriptor.enumerable).toBeFalsy()
  })

})
