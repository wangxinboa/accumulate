export function isFunction(data) {
	return typeof data === 'function';
}

export function isNumber(data) {
	return typeof data === 'number';
}

export function isString(data) {
	return typeof data === 'string';
}

export function isBoolean(data) {
	return typeof data === 'boolean';
}

// 判断变量是否是简单数据类型
export function isPrimitive(value) {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		value === null ||
		typeof value === 'undefined' ||
		typeof value === 'symbol'
	);
}

// 判断变量是否是普通对象
export function isPlainObject(data) {
	if (typeof data !== 'object' || data === null) {
		return false;
	}
	const proto = Object.getPrototypeOf(data);
	return proto === Object.prototype || proto === null;
}


export function isObject(data) {
	return typeof data === 'object' && data !== null;
}

// 检查是否是一个对象并且不是数组
export function isNonArrayObject(data) {
	return data !== null && typeof data === 'object' && !Array.isArray(data);
}