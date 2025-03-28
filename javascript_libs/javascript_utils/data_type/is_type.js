export function isNumber(data) {
	return typeof data === 'number';
}

export function isString(data) {
	return typeof data === 'string';
}

export function isBoolean(data) {
	return typeof data === 'boolean';
}

export function isFunction(data) {
	return typeof data === 'function';
}

const OriginalFunctionAttrs = ['arguments', 'caller', 'length', 'name', 'prototype'];

export function isPrimitiveFunction(data) {
	if (isFunction(data)) {

		const descriptors = Object.getOwnPropertyDescriptors(data);
		let keyCount = 0;

		for (let i = 0, len = OriginalFunctionAttrs.length; i < len; i++) {
			if (descriptors.hasOwnProperty(OriginalFunctionAttrs[i])) {
				keyCount++;
			}
		}

		if (Object.keys(descriptors).length !== keyCount) {
			return false;
		}

		const functionPrototype = data.prototype;
		if (
			functionPrototype !== void 0 &&
			(
				Object.keys(Object.getOwnPropertyDescriptors(functionPrototype)).length !== 1 ||
				functionPrototype.constructor !== data
			)
		) {
			return false;
		}

		return true;
	}
	return false;
}

export function isPlainObject(obj) {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}
	const proto = Object.getPrototypeOf(obj);
	return proto === Object.prototype || proto === null;
}


export function isObject(data) {
	return typeof data === 'object' && data !== null;
}

// 检查是否是一个对象并且不是数组
export function isNonArrayObject(data) {
	return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}