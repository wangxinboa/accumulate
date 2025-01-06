export function isFunction(data) {
	return typeof data === 'function';
}

const OriginalFunctionAttrs = ['arguments', 'caller', 'length', 'name', 'prototype'];

export function isOriginalFunction(data) {
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

export function isObject(data) {
	return typeof data === 'object'
}
