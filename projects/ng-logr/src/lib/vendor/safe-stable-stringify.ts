// This is the safe-stable-stringify library, but it has been transpiled down to from es6 to es5 for compatibility reasons.
// https://github.com/BridgeAR/safe-stable-stringify

/* tslint:disable */

'use strict'

const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
  return typeof obj
} : function (obj) {
  return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
}

var gap = ''
// eslint-disable-next-line
const strEscapeSequencesRegExp = /[\x00-\x1f\x22\x5c]/
// eslint-disable-next-line
const strEscapeSequencesReplacer = /[\x00-\x1f\x22\x5c]/g

// Escaped special characters. Use empty strings to fill up unused entries.
const meta = ['\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t', '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013', '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d', '\\u001e', '\\u001f', '', '', '\\"', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '\\\\']

const escapeFn = function escapeFn(str) {
  return meta[str.charCodeAt(0)]
}

// Escape control characters, double quotes and the backslash.
// Note: it is faster to run this only once for a big string instead of only for
// the parts that it is necessary for. But this is only true if we do not add
// extra indentation to the string before.
function strEscape(str) {
  // Some magic numbers that worked out fine while benchmarking with v8 6.0
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) {
    return str
  }
  if (str.length > 100) {
    return str.replace(strEscapeSequencesReplacer, escapeFn)
  }
  var result = ''
  var last = 0
  for (var i = 0; i < str.length; i++) {
    const point = str.charCodeAt(i)
    if (point === 34 || point === 92 || point < 32) {
      if (last === i) {
        result += meta[point]
      } else {
        result += '' + str.slice(last, i) + meta[point]
      }
      last = i + 1
    }
  }
  if (last === 0) {
    result = str
  } else if (last !== i) {
    result += str.slice(last)
  }
  return result
}

// Full version: supports all options
function stringifyFullFn(key, parent, stack, replacer, indent) {
  var i, res, join
  const mind = gap
  var value = parent[key]

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }
  value = replacer.call(parent, key, value)

  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += '\n' + gap
          join = ',\n' + gap
        }
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const _tmp2 = stringifyFullFn(i, value, stack, replacer, indent)
          res += _tmp2 !== undefined ? _tmp2 : 'null'
          res += join
        }
        const _tmp = stringifyFullFn(i, value, stack, replacer, indent)
        res += _tmp !== undefined ? _tmp : 'null'
        if (gap !== '') {
          res += '\n' + mind
        }
        res += ']'
        stack.pop()
        gap = mind
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      if (gap === '') {
        join = ','
      } else {
        res += '\n' + gap
        join = ',\n' + gap
      }
      var last = false
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const _tmp3 = stringifyFullFn(key, value, stack, replacer, indent)
        if (_tmp3 !== undefined) {
          if (last) {
            res += join
          }
          res += '"' + strEscape(key) + '"' + (gap !== '' ? ': ' : ':') + _tmp3
          last = true
        }
      }
      key = keys[i]
      const tmp = stringifyFullFn(key, value, stack, replacer, indent)
      if (tmp !== undefined) {
        if (last) {
          res += join
        }
        if (gap === '') {
          res += '"' + strEscape(key) + '":' + tmp
        } else {
          res += '"' + strEscape(key) + '": ' + tmp + '\n' + mind
        }
      } else if (gap !== '') {
        if (last) {
          res += '\n' + mind
        } else {
          res = '{'
        }
      }
      res += '}'
      stack.pop()
      gap = mind
      return res
    case 'string':
      return '"' + strEscape(value) + '"'
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

function stringifyFullArr(key, value, stack, replacer, indent) {
  var i, res, join
  const mind = gap

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }

  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += '\n' + gap
          join = ',\n' + gap
        }
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const _tmp4 = stringifyFullArr(i, value[i], stack, replacer, indent)
          res += _tmp4 !== undefined ? _tmp4 : 'null'
          res += join
        }
        const tmp = stringifyFullArr(i, value[i], stack, replacer, indent)
        res += tmp !== undefined ? tmp : 'null'
        if (gap !== '') {
          res += '\n' + mind
        }
        res += ']'
        stack.pop()
        gap = mind
        return res
      }

      if (replacer.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      if (gap === '') {
        join = ','
      } else {
        res += '\n' + gap
        join = ',\n' + gap
      }
      var last = false
      for (i = 0; i < replacer.length; i++) {
        if (typeof replacer[i] === 'string' || typeof replacer[i] === 'number') {
          key = replacer[i]
          const _tmp5 = stringifyFullArr(key, value[key], stack, replacer, indent)
          if (_tmp5 !== undefined) {
            if (last) {
              res += join
            }
            res += '"' + strEscape(key) + '"' + (gap ? ': ' : ':') + _tmp5
            last = true
          }
        }
      }
      if (gap !== '') {
        if (last) {
          res += '\n' + mind
        } else {
          res = '{'
        }
      }
      res += '}'
      stack.pop()
      gap = mind
      return res
    case 'string':
      return '"' + strEscape(value) + '"'
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Supports only the spacer option
function stringifyIndent(key, value, stack, indent) {
  var i, res, join, add
  const mind = gap

  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (typeof value.toJSON === 'function') {
        value = value.toJSON(key)
        // Prevent calling `toJSON` again.
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          return stringifyIndent(key, value, stack, indent)
        }
        if (value === null) {
          return 'null'
        }
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += '\n' + gap
          join = ',\n' + gap
        }
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const _tmp7 = stringifyIndent(i, value[i], stack, indent)
          res += _tmp7 !== undefined ? _tmp7 : 'null'
          res += join
        }
        const _tmp6 = stringifyIndent(i, value[i], stack, indent)
        res += _tmp6 !== undefined ? _tmp6 : 'null'
        if (gap !== '') {
          res += '\n' + mind
        }
        res += ']'
        stack.pop()
        gap = mind
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      if (gap === '') {
        join = ','
        add = ''
      } else {
        add = '\n' + gap
        join = ',\n' + gap
      }
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const _tmp8 = stringifyIndent(key, value[key], stack, indent)
        if (_tmp8 !== undefined) {
          add += '"' + strEscape(key) + '"' + (gap ? ': ' : ':') + _tmp8 + join
        }
      }
      key = keys[i]
      const tmp = stringifyIndent(key, value[key], stack, indent)
      if (tmp !== undefined) {
        if (gap === '') {
          add += '"' + strEscape(key) + '":' + tmp
        } else {
          add += '"' + strEscape(key) + '": ' + tmp + '\n' + mind
        }
      }
      if (add.length > gap.length + 1) {
        res += add
      }
      res += '}'
      stack.pop()
      gap = mind
      return res
    case 'string':
      return '"' + strEscape(value) + '"'
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Supports only the replacer option
function stringifyReplacerArr(key, value, stack, replacer) {
  var i, res
  // If the value has a toJSON method, call it to obtain a replacement value.
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }

  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const _tmp9 = stringifyReplacerArr(i, value[i], stack, replacer)
          res += _tmp9 !== undefined ? _tmp9 : 'null'
          res += ','
        }
        const tmp = stringifyReplacerArr(i, value[i], stack, replacer)
        res += tmp !== undefined ? tmp : 'null'
        res += ']'
        stack.pop()
        return res
      }

      if (replacer.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      var last = false
      for (i = 0; i < replacer.length; i++) {
        if (typeof replacer[i] === 'string' || typeof replacer[i] === 'number') {
          key = replacer[i]
          const _tmp10 = stringifyReplacerArr(key, value[key], stack, replacer)
          if (_tmp10 !== undefined) {
            if (last) {
              res += ','
            }
            res += '"' + strEscape(key) + '":' + _tmp10
            last = true
          }
        }
      }
      res += '}'
      stack.pop()
      return res
    case 'string':
      return '"' + strEscape(value) + '"'
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

function stringifyReplacerFn(key, parent, stack, replacer) {
  var i, res
  var value = parent[key]
  // If the value has a toJSON method, call it to obtain a replacement value.
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }
  value = replacer.call(parent, key, value)

  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const _tmp12 = stringifyReplacerFn(i, value, stack, replacer)
          res += _tmp12 !== undefined ? _tmp12 : 'null'
          res += ','
        }
        const _tmp11 = stringifyReplacerFn(i, value, stack, replacer)
        res += _tmp11 !== undefined ? _tmp11 : 'null'
        res += ']'
        stack.pop()
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      var last = false
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const _tmp13 = stringifyReplacerFn(key, value, stack, replacer)
        if (_tmp13 !== undefined) {
          if (last === true) {
            res += ','
          }
          res += '"' + strEscape(key) + '":' + _tmp13
          last = true
        }
      }
      key = keys[i]
      const tmp = stringifyReplacerFn(key, value, stack, replacer)
      if (tmp !== undefined) {
        if (last === true) {
          res += ','
        }
        res += '"' + strEscape(key) + '":' + tmp
      }
      res += '}'
      stack.pop()
      return res
    case 'string':
      return '"' + strEscape(value) + '"'
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Simple without any options
function stringifySimple(key, value, stack) {
  var i, res
  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (typeof value.toJSON === 'function') {
        value = value.toJSON(key)
        // Prevent calling `toJSON` again
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          return stringifySimple(key, value, stack)
        }
        if (value === null) {
          return 'null'
        }
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        // Use null as placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const _tmp15 = stringifySimple(i, value[i], stack)
          res += _tmp15 !== undefined ? _tmp15 : 'null'
          res += ','
        }
        const _tmp14 = stringifySimple(i, value[i], stack)
        res += _tmp14 !== undefined ? _tmp14 : 'null'
        res += ']'
        stack.pop()
        return res
      }

      const keys = insertSort(Object.keys(value))
      if (keys.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const _tmp16 = stringifySimple(key, value[key], stack)
        if (_tmp16 !== undefined) {
          res += '"' + strEscape(key) + '":' + _tmp16 + ','
        }
      }
      key = keys[i]
      const tmp = stringifySimple(key, value[key], stack)
      if (tmp !== undefined) {
        res += '"' + strEscape(key) + '":' + tmp
      }
      res += '}'
      stack.pop()
      return res
    case 'string':
      return '"' + strEscape(value) + '"'
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      // Convert the numbers implicit to a string instead of explicit.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

function insertSort(arr) {
  for (var i = 1; i < arr.length; i++) {
    const tmp = arr[i]
    var j = i
    while (j !== 0 && arr[j - 1] > tmp) {
      arr[j] = arr[j - 1]
      j--
    }
    arr[j] = tmp
  }

  return arr
}

export function stringify(value: any,
                          replacer?: (key: string, value: any) => any | (number | string)[] | null,
                          spacer?: string | number): string {
  var i
  var indent = ''
  gap = ''

  if (arguments.length > 1) {
    // If the spacer parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof spacer === 'number') {
      for (i = 0; i < spacer; i += 1) {
        indent += ' '
      }
      // If the spacer parameter is a string, it will be used as the indent string.
    } else if (typeof spacer === 'string') {
      indent = spacer
    }
    if (indent !== '') {
      if (replacer !== undefined && replacer !== null) {
        if (typeof replacer === 'function') {
          return stringifyFullFn('', {'': value}, [], replacer, indent)
        }
        if (Array.isArray(replacer)) {
          return stringifyFullArr('', value, [], replacer, indent)
        }
      }
      return stringifyIndent('', value, [], indent)
    }
    if (typeof replacer === 'function') {
      return stringifyReplacerFn('', {'': value}, [], replacer)
    }
    if (Array.isArray(replacer)) {
      return stringifyReplacerArr('', value, [], replacer)
    }
  }
  return stringifySimple('', value, [])
}
