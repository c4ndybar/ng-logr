import safeStringify from 'safe-stable-stringify'

export class SerializerUtility {
  public static stringify(obj): string {
    function replacer(_key, value) {
      if (value instanceof Error) {
        value = getSerializableErrorObj(value)
      } else if (isDebugContext(value)) {
        value = getDebugContextSerializedValue()
      }

      return value
    }

    function getSerializableErrorObj(errorObj) {
      const error = {}
      // remove the angular properties from the error object because we do not want to post that data.
      // we also need to make the stack and message properties are enumerable
      Object.getOwnPropertyNames(errorObj).forEach(function (key) {
        if (!['ngDebugContext', 'ngErrorLogger', 'DebugContext_'].includes(key)) {
          error[key] = errorObj[key]
        }
      })
      return error
    }

    function isDebugContext(obj) {
      return obj && obj.constructor.name === 'DebugContext_'
    }

    function getDebugContextSerializedValue() {
      return '[DebugContext_]'
    }

    return (safeStringify as any)(obj, replacer)
  }


}

