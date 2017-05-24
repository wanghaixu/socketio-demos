module.exports = {
  isArray: (obj) => Object.prototype.toString.call(obj) === '[object Array]',
  isObject: (obj) => Object.prototype.toString.call(obj) === '[object Object]',
  isFunction: (obj) => Object.prototype.toString.call(obj) === '[object Function]',
  isNumber: (obj) => Object.prototype.toString.call(obj) === '[object Number]',
  isString: (obj) => Object.prototype.toString.call(obj) === '[object String]',
  isDate: (obj) => Object.prototype.toString.call(obj) === '[object Date]',
  isRegExp: (obj) => Object.prototype.toString.call(obj) === '[object RegExp]',
  isBoolean: (obj) => Object.prototype.toString.call(obj) === '[object Boolean]',
  isNull: (obj) => Object.prototype.toString.call(obj) === '[object Null]',
  isUndefined: (obj) => Object.prototype.toString.call(obj) === '[object Undefined]',
}