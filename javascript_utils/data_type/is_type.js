export function isFunction(data) {
  return typeof data === 'function';
}

export function isObject(data) {
  return data.__proto__ === Object.prototype;
}
