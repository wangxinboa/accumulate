/**
 * 判断变量是否是函数
 * @param {any} data
 * @returns {boolean}
 */
export function isFunction(data) {
	return typeof data === "function";
}
/**
 *
 * @param {any} data
 * @returns {boolean}
 */
export function isNumber(data) {
	return typeof data === "number";
}
/**
 *
 * @param {any} data
 * @returns {boolean}
 */
export function isString(data) {
	return typeof data === "string";
}
/**
 *
 * @param {any} data
 * @returns {boolean}
 */
export function isBoolean(data) {
	return typeof data === "boolean";
}
/**
 * 判断变量是否是简单数据类型
 * @param {any} data
 * @returns {boolean}
 */
export function isPrimitive(data) {
	return (
		typeof data === "string" ||
		typeof data === "number" ||
		typeof data === "boolean" ||
		data === null ||
		typeof data === "undefined" ||
		typeof data === "symbol"
	);
}
/**
 * 判断变量是否是普通对象
 * @param {any} data
 * @returns {boolean}
 */
export function isPlainObject(data) {
	if (typeof data !== "object" || data === null) {
		return false;
	}
	const proto = Object.getPrototypeOf(data);
	return proto === Object.prototype || proto === null;
}
/**
 *
 * @param {any} data
 * @returns {boolean}
 */
export function isObject(data) {
	return typeof data === "object" && data !== null;
}
/**
 * 判断变量是否是一个对象并且不是数组
 * @param {any} data
 * @returns {boolean}
 */
export function isNonArrayObject(data) {
	return data !== null && typeof data === "object" && !Array.isArray(data);
}
